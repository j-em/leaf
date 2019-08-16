import { Box, Flex } from "@rebass/emotion";
import { css, cx } from "emotion";
import { Immutable } from "immer";
import keyCode from "keycode-js";
import {
  createContext,
  Dispatch,
  useCallback,
  useContext,
  useEffect,
  MouseEventHandler
} from "react";
import React, {
  Reducer,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState
} from "react";

import Resizer from "./resizer";
import theme from "./theme";
import useTable, { Row, RecordIso } from "./useTable";

type RowProps = {
  onClick?: React.MouseEventHandler;
  onDoubleClick?: React.MouseEventHandler;
  onMouseOver?: () => void;
  children?: React.ReactNode;
  className?: string;
  width: number;
};

const Row: React.FC<RowProps> = React.memo(function Row(props) {
  return (
    <Flex
      onClick={props.onClick}
      onDoubleClick={props.onDoubleClick}
      onMouseOver={props.onMouseOver}
      className={cx(css({ width: `${props.width}px` }), props.className)}
    >
      {props.children}
    </Flex>
  );
});

type ColProps = {
  key?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  width?: number;
  onClick?: React.MouseEventHandler;
  onDoubleClick?: React.MouseEventHandler;
  onHover?: () => void;
};

const Col: React.FC<ColProps> = React.memo(function Col({
  children,
  className,
  ...rest
}) {
  return (
    <Box
      key={rest.key}
      className={cx(
        css({
          position: "relative",
          padding: "15px",
          flexShrink: 0,
          flexGrow: 0,
          fontFamily: theme.fonts.sans,
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflowX: "hidden",
          width: rest.width,
          borderBottom: `1px solid ${theme.colors.coolGray["10"]}`,
          borderRight: `1px solid ${theme.colors.coolGray["20"]}`
        }),
        className
      )}
    >
      {children}
    </Box>
  );
});

type TableProps<T> = {
  data: Immutable<T>[];
  containerWidth: number;
  minColWidth: number;
  onRowDoubleClick?: (ev: React.MouseEvent) => (record: T) => void;
  onRowClick?: (ev: React.MouseEvent) => (record: T) => void;
  headerFormatter?: (header: keyof T) => string;
};

const Table = <T extends {}>(props: TableProps<T>) => {
  const [keyDown, setKeyDown] = useState<number>();

  useEffect(() => {
    switch (keyDown) {
      case keyCode.KEY_UP:
        dispatch({ type: "selectPrev" });
        break;

      case keyCode.KEY_DOWN:
        dispatch({ type: "selectNext" });
        break;
    }
  }, [keyDown]);

  const [tableState, dispatch] = useTable({
    records: props.data,
    containerWidth: props.containerWidth,
    minColWidth: props.minColWidth
  });

  return (
    <Box
      tabIndex={0}
      className={css({ userSelect: "none" })}
      onKeyDown={e => setKeyDown(e.keyCode)}
      onKeyUp={e => setKeyDown(undefined)}
    >
      <Row width={Object.values(tableState.sizer).reduce((sum, n) => sum + n)}>
        {tableState.headers.cols.map(col => {
          return (
            <Col
              style={{
                position: "relative",
                fontWeight: 600,
                fontSize: "1.3em"
              }}
              width={tableState.sizer[col.key]}
              key={col.key}
            >
              {(props.headerFormatter &&
                props.headerFormatter(col.value as keyof T)) ||
                col.value}

              <Resizer
                colId={col.key}
                currentWidth={tableState.sizer[col.key]}
                minWidth={props.minColWidth}
                onResize={(newWidth: number) => {
                  dispatch({
                    type: "setColWidth",
                    colKey: col.key,
                    width: newWidth
                  });
                }}
              />
            </Col>
          );
        })}
      </Row>
      {tableState.rows.map((row, rowIndex) => {
        const isSelected =
          tableState.selection &&
          rowIndex >= tableState.selection[0] &&
          rowIndex <= tableState.selection[1];

        return (
          <Row
            width={Object.values(tableState.sizer).reduce(
              (sum, next) => next + sum
            )}
            key={rowIndex}
            className={css({
              cursor: "pointer",
              color: isSelected ? "white" : "initial",
              backgroundColor: isSelected ? theme.roles.interactive03 : "white"
            })}
            onClick={ev => {
              dispatch({ type: "clearSelection" });
              dispatch({ type: "setSelection", index: rowIndex });
              props.onRowClick && props.onRowClick(ev)(RecordIso<T>().wrap(row));
            }}
            onDoubleClick={props.onRowDoubleClick}
          >
            {row.cols.map(col => {
              return (
                <Col key={col.key} width={tableState.sizer[col.key]}>
                  {col.value}
                </Col>
              );
            })}
          </Row>
        );
      })}
    </Box>
  );
};

export { Table, Col, Row };
