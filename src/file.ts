import { array } from "fp-ts/lib/Array";
import { IO } from "fp-ts/lib/IO";
import { tryCatch, left } from "fp-ts/lib/IOEither";
import { fromNullable, Option, option } from "fp-ts/lib/Option";
import fs from "fs-jetpack";
import { InspectOptions, InspectResult } from "fs-jetpack/types";

import Path from "path";
import { Observable, of, empty, from, pipe } from "rxjs";
import { map, filter } from "rxjs/operators";

type Error = "READ_ERROR" | "WRITE_ERROR";

export type File =
  | ({
      id: string;
      type: "dir";
      content: IO<Option<File>[]>;
    })
  | { id: string; type: "file" };

const list = (path: string) => fromNullable(fs.list(path));
const inspect = (path: string) => fromNullable(fs.inspectTree(path));

const createFsTree = (path: string): Option<File> => {
  return inspect(path).map(result =>
    result.type === "dir"
      ? {
          id: result.name,
          type: "dir",
          content: new IO(() =>
            result.children.map(result => createFsTree(result.absolutePath!))
          )
        }
      : { id: result.name, type: "file" }
  );
};

const dir: File = {
  id: "/",
  type: "dir",
  content: empty()
};
