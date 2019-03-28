import sort from "ramda/es/sort";
import { Kb } from "./units";

export type File = {
  kind: "folder" | "text";
  path: string;
  size: Kb;
  modifiedTime: Date;
  createdTime: Date;
};

export const sortByPath = (files: File[]) =>
  sort((f1, f2) => {
    if (f1.path > f2.path) {
      return 1;
    } else if (f1.path < f2.path) {
      return -1;
    } else {
      return 0;
    }
  }, files);

export const sortBySize = (files: File[]) =>
  sort((f1, f2) => {
    if (f1.size > f2.size) {
      return 1;
    } else if (f1.size < f2.size) {
      return -1;
    } else {
      return 0
    }
  }, files);
