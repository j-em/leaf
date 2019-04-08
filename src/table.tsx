import { Box, Flex } from '@rebass/emotion';
import { css, cx } from 'emotion';
import { range } from 'fp-ts/lib/Array';
import { insert } from 'fp-ts/lib/Map';
import { setoidNumber } from 'fp-ts/lib/Setoid';
import { createContext, useContext, useEffect } from 'react';
import React, { Reducer, useLayoutEffect, useReducer, useRef, useState } from 'react';

import theme from './theme';
import useContainerWidth from './useContainerWidth';

type RowProps = {
  onClick?: () => void;
  onDoubleClick?: () => void;
  onMouseOver?: () => void;
  children?: React.ReactElement[];
  className?: string;
};

const Row: React.FC<RowProps> = props => {
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
};

type ColProps = {
  onClick?: () => void;
  onDoubleClick?: () => void;
  onMouseOver?: () => void;
  children?: React.ReactNode;
  className?: string;
};
const Col: React.FC<ColProps> = ({ children, ...rest }) => {
  return (
    <Box
      onClick={rest.onClick}
      onDoubleClick={rest.onDoubleClick}
      onMouseOver={rest.onMouseOver}
      className={cx(
        rest.className,
        css({
          padding: "0.5em",
          fontFamily: theme.fonts.sans,
          overflowX: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          flexShrink: 0,
          borderBottom: `1px solid ${theme.colors.coolGray["10"]}`,
          borderRight: `1px solid ${theme.colors.coolGray["20"]}`
        })
      )}
    >
      {children}
    </Box>
  );
};

type TableState = {
  colSize: Map<number, number>;
};
type TableAction = { type: "setColSize"; colIndex: number; size: number };

type TableProps = {
  children: React.ReactElement<{ children: React.ReactElement[] }>[];
};

const useTableState = (defaultState: TableState) => {
  const [state, dispatch] = useReducer<Reducer<TableState, TableAction>>(
    (prevState, action) => {
      switch (action.type) {
        case "setColSize":
          const colSize = insert<number>(setoidNumber)(
            action.colIndex,
            action.size,
            prevState.colSize
          );
          return { ...prevState, colSize };
      }
      return prevState;
    },
    defaultState
  );

  return [state, dispatch] as const;
};

const Table: React.FC<TableProps> = props => {
  const [containerWidth, ref] = useContainerWidth();

  const numberOfCols = Math.max(
    ...props.children.map(row => row.props.children.length)
  );

  const [tableState, dispatch] = useTableState({
    colSize: new Map(range(0, numberOfCols - 1).map(k => [k, 0]))
  });

  useEffect(() => {
    Array.from(tableState.colSize.keys()).map(col =>
      dispatch({
        type: "setColSize",
        colIndex: col,
        size: containerWidth / numberOfCols
      })
    );
  }, [containerWidth]);

  return (
    <Box ref={ref}>
      {props.children.map(row => {
        return React.cloneElement(row, {
          children: row.props.children.map((col, colIndex) =>
            React.cloneElement(col, {
              className: css({ width: tableState.colSize.get(colIndex) })
            })
          )
        });
      })}
    </Box>
  );
};

export { Table, Col, Row };
