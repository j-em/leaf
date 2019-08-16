import { remote } from "electron";
import { Lens } from "monocle-ts";
import Path from "path";
import { useEffect, useReducer } from "react";
import Glob from "tiny-glob";
import { File } from "./file";
import { Kb } from "./units";
const fs: typeof import("fs") = remote.require("fs");

type State = {
  isSearching: boolean;
  exactMatch?: File;
  partialMatches: File[];
};

const PartialMatches = Lens.fromProp<State>()("partialMatches");
const ExactMatch = Lens.fromProp<State>()("exactMatch");
const isSearching = Lens.fromProp<State>()("isSearching");

type Action =
  | {
      type: "START_SEARCHING";
    }
  | {
      type: "STOP_SEARCHING";
    }
  | { type: "SET_EXACT_MATCH"; match?: File }
  | { type: "SET_PARTIAL_MATCHES"; matches: File[] };

const useSearch = (pattern: string) => {
  const [state, dispatch] = useReducer<React.Reducer<State, Action>>(
    (prevState, action) => {
      switch (action.type) {
        case "SET_PARTIAL_MATCHES":
          return PartialMatches.set(action.matches)(prevState);

        case "SET_EXACT_MATCH":
          return ExactMatch.set(action.match)(prevState);

        case "START_SEARCHING":
          return isSearching.set(true)(prevState);

        case "STOP_SEARCHING":
          return isSearching.set(false)(prevState);
      }
    },
    { isSearching: false, exactMatch: undefined, partialMatches: [] }
  );

  useEffect(() => {
    async function getMatches(pattern: string): Promise<File[]> {
      dispatch({ type: "START_SEARCHING" });

      const matches = (await Glob(pattern, { absolute: true, cwd: "/" })).map(
        (fullPath) : File => {
          const stats = fs.statSync(fullPath);
          return {
            type: stats.isDirectory() ? "dir" : "file",
            name: fullPath,
            absolutePath: fullPath,
            size: Kb.wrap(stats.size),
            modifiedTime: stats.mtime
          };
        }
      );
      return matches;
    }

    getMatches(`${pattern.replace("*", "")}*`)
      .then(matches => dispatch({ type: "SET_PARTIAL_MATCHES", matches }))
      .finally(() => dispatch({ type: "STOP_SEARCHING" }));

    if (fs.existsSync(pattern)) {
      const stats = fs.statSync(pattern);
      const match: File = {
        type: stats.isDirectory() ? "dir" : "file",
        name: pattern,
        absolutePath: pattern,
        size: Kb.wrap(stats.size),
        modifiedTime: stats.mtime
      };

      dispatch({ type: "SET_EXACT_MATCH", match });
    } else {
      dispatch({ type: "SET_EXACT_MATCH", match: undefined });
    }
  }, [pattern]);

  return state;
};

export default useSearch;
