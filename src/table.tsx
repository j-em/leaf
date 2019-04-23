import { Box, Flex } from "@rebass/emotion";
import { css, cx } from "emotion";
import {
  createContext,
  Dispatch,
  useCallback,
  useContext,
  useEffect
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
import useRect from "./useRect";
import useResizing from "./useResizing";
import useTable from "./useTable";

type RowProps = {
  onClick?: () => void;
  onDoubleClick?: () => void;
  onMouseOver?: () => void;
  children?: React.ReactNode;
  className?: string;
};

const Row: React.FC<RowProps> = React.memo(props => {
  return (
    <Flex
      onClick={props.onClick}
      onDoubleClick={props.onDoubleClick}
      onMouseOver={props.onMouseOver}
      className={props.className}
    >
      {props.children}
    </Flex>
  );
});

type ColProps = {
  id?: string;
  onWidthChange?: (newWidth: number) => void;
  children?: React.ReactNode;
  minWidth?: number;
  width?: number;
  resizer?: React.ReactElement;
};

const Col: React.FC<ColProps> = React.memo(({ children, resizer, ...rest }) => {
  return (
    <Box
      className={cx(
        css({
          position: "relative",
          padding: "10px 0px",
          flexShrink: 0,
          flexGrow: 0,
          fontFamily: theme.fonts.sans,
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          width: rest.width,
          borderBottom: `1px solid ${theme.colors.coolGray["10"]}`,
          borderRight: `1px solid ${theme.colors.coolGray["20"]}`
        })
      )}
    >
      {children}
      {resizer}
    </Box>
  );
});

export type HeaderProps = ColProps;
export const Header: React.FC<HeaderProps> = React.memo(
  ({ onWidthChange, minWidth = 200, width, ...props }) => {
    const resizerRef = useRef();
    const resizerRect = useRect(resizerRef, [width]);

    const [resizingState, dispatch] = useResizing({
      minWidth,
      width: width || minWidth,
      resizerRect
    });

    const onMouseDown = useCallback(() => dispatch({ type: "START_RESIZE" }), [
      dispatch
    ]);

    useLayoutEffect(() => {
      switch (resizingState.status) {
        case "resized":
          onWidthChange && onWidthChange(resizingState.to);
          break;

        case "resumedResize":
          if (onWidthChange && resizerRect) {
            const mousePos = resizingState.at.x;
            const resizerEdge = resizerRect.x + resizerRect.width;

            const correctedWidth =
              mousePos > resizerEdge
                ? width! + (mousePos - resizerEdge)
                : undefined;

            if (correctedWidth) {
              onWidthChange(correctedWidth);
            }
          }
          break;
      }
    }, [resizingState]);

    const resizer = useMemo(
      () => <Resizer ref={resizerRef} onMouseDown={onMouseDown} />,
      [onMouseDown]
    );

    return (
      <Col resizer={resizer} width={width}>
        {props.children}
      </Col>
    );
  }
);

type TableProps<T extends Required<T>> = {
  children: T[];
  containerWidth: number;
};

const Table = <T extends Required<T>>(props: TableProps<T>) => {
  const [tableState, dispatch] = useTable({
    rows: props.children,
    containerWidth: props.containerWidth
  });

  const onWidthChange: (
    colId: string
  ) => (newWidth: number) => void = colId => newWidth => {
    dispatch({ type: "setColWidth", colId: colId, width: newWidth });
  };

  return (
    <Box className={css({ userSelect: "none" })}>
      <Row>
        {tableState.headers.map(cell => {
          return (
            <Header
              key={cell.value}
              width={cell.width}
              id={cell.colId}
              onWidthChange={onWidthChange(cell.colId)}
            >
              {cell.value}
            </Header>
          );
        })}
      </Row>
      {tableState.rows.map(row => (
        <Row>
          {row.map(cell => {
            return (
              <Col key={cell.value} width={cell.width} id={cell.colId}>
                {cell.value}
              </Col>
            );
          })}
        </Row>
      ))}
    </Box>
  );
};

export { Table, Col, Row };
