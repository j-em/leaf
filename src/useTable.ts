import { array } from "fp-ts/lib/Array";
import { produce } from "immer";
import { fromTraversable, Iso, Lens, Optional, Traversal } from "monocle-ts";
import { indexRecord } from "monocle-ts/lib/Index/Record";
import React, { useEffect, useReducer } from "react";

export type Col = { value: string; key: string };
export type Row = { cols: Col[] };

type Range = [number, number];

const Selection = Optional.fromNullableProp<State>()("selection");

const SelectionStart = new Lens<Range, number>(
  range => range[0],
  newStart => range => [newStart, range[1]]
);
const SelectionEnd = new Lens<Range, number>(
  range => range[1],
  newEnd => range => [range[0], newEnd]
);

interface Sizer {
  [x: string]: number;
}

type State = {
  sizer: Sizer;
  selection?: Range;
  headers: Row;
  rows: Row[];
};

type Props<T> = {
  records: T[];
  minColWidth: number;
  containerWidth: number;
};

type Action =
  | { type: "setColWidth"; colKey: string; width: number }
  | { type: "setSelection"; index: number }
  | { type: "selectNext" }
  | { type: "selectPrev" }
  | { type: "clearSelection" }
  | { type: "resetState"; value: State };

const Rows: Traversal<Row[], Row> = fromTraversable(array)();
const Cols: Traversal<Row, Col> = Lens.fromProp<Row>()("cols").composeTraversal(
  fromTraversable(array)()
);

export const RecordIso = <T extends Record<string, any>>(): Iso<T, Row> =>
  new Iso(
    (record): Row => ({
      cols: Object.entries(record).map(
        ([colKey, colValue], colIndex, cols) => ({
          value: colValue.toString(),
          key: colKey
        })
      )
    }),
    row => {
      return Object.assign(
        {},
        ...row.cols.map(cell => ({ [cell.key]: cell.value } as const))
      );
    }
  );

const defaultState = produce(
  <T>(draft: Props<T>): State => {
    const rows = draft.records.map(record => RecordIso<T>().unwrap(record));

    return {
      sizer: rows[0].cols.reduce<Sizer>(
        (sizer, col) => ({ ...sizer, [col.key]: 0 }),
        {}
      ),
      selection: undefined,
      headers: RecordIso<T>().unwrap(draft.records[0]),
      rows
    };
  }
);

export default (props: Props<Record<string, any>>) => {
  const [state, dispatch] = useReducer<React.Reducer<State, Action>>(
    (prevState, action): State => {
      const numberOfItems = prevState.rows.length;

      switch (action.type) {
        case "selectPrev": {
          const updateSelection = Selection.composeLens(
            SelectionEnd
          ).modifyOption(start => (start > 0 ? start - 1 : start));

          return updateSelection(prevState).getOrElse(
            Selection.set([numberOfItems - 1, numberOfItems - 1])(prevState)
          );
        }

        case "selectNext": {
          const updateSelection = Selection.composeLens(
            SelectionEnd
          ).modifyOption(end =>
            end >= prevState.rows.length - 1 ? end + 1 : end
          );

          return updateSelection(prevState).getOrElse(
            Selection.set([0, 0])(prevState)
          );
        }

        case "clearSelection":
          return { ...prevState, selection: undefined };

        case "setSelection":
          return Selection.set([action.index, action.index])(prevState);

        case "setColWidth": {
          return Lens.fromProp<State>()("sizer")
            .composeOptional(indexRecord<number>().index(action.colKey))
            .set(action.width)(prevState);
        }

        case "resetState":
          return action.value;

        default: {
          return prevState;
        }
      }
    },
    defaultState(props)
  );

  return [state, dispatch] as const;
};
