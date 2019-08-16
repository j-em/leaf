import fs from "fs-jetpack";
import Path from "path";
import React, { Reducer, useEffect, useReducer, useState } from "react";
import { fromNullable, Option } from "fp-ts/lib/Option";

import { File, FsGetter, inspect } from "./file";
import FileTable from "./fileTable";

type Props = {
  path: string;
};


const useDirContent: (path: string) => File[] = path => {
  const [dirContent, setDirContent] = useState<File[]>();

  useEffect(() => {
    const dirContent: Option<File[]> = fromNullable(inspect(path))
      .filter(result => result.type === "dir")
      .chain(dirStats =>
        fromNullable(dirStats.absolutePath).chain(absolutePath =>
          fromNullable(list(absolutePath)).map(children =>
            children.map(relativePath => {
              const childAbsolutePath = Path.join(absolutePath, relativePath);
              return {
                id: absolutePath,
                absolutePath: childAbsolutePath,
                size: dirStats.size
              };
            })
          )
        )
      );
  }, [path]);
};

export default (props: Props) => {
  const file = useLocalFile(props.path);

  return <FileTable files={files} />;
};
