import React, { useReducer } from "react";

export type Cell = { value: string; width: number; colId: string };
export type Row = ReadonlyArray<Cell>;

type State = {
  headers: Row;
  rows: ReadonlyArray<Row>;
};

type Action = { type: "setColWidth"; colId: string; width: number };

export default <T extends Required<T>>(props: {
  rows: T[];
  containerWidth: number;
}) => {
  const [state, dispatch] = useReducer<React.Reducer<State, Action>, number>(
    (prevState, action) => {
      switch (action.type) {
        case "setColWidth": {
          return {
            headers: prevState.headers.map(col =>
              col.colId === action.colId ? { ...col, width: action.width } : col
            ),
            rows: prevState.rows.map(row =>
              row.map(col => {
                return col.colId === action.colId
                  ? { ...col, width: action.width }
                  : col;
              })
            )
          };
        }
      }
    },
    props.containerWidth,
    containerWidth => {
      return {
        headers: Object.keys(props.rows[0]).map((colKey, colIndex) => ({
          value: colKey,
          colId: colKey,
          width: containerWidth / Object.keys(props.rows[0]).length,
          isHeader: true
        })),
        rows: props.rows.map(row =>
          Object.entries(row).map(([colKey, colValue], colIndex) => ({
            value: colValue.toString(),
            width: containerWidth / Object.keys(props.rows[0]).length,
            colId: colKey,
            isHeader: false
          }))
        )
      };
    }
  );

  return [state, dispatch] as const;
};
