import React from 'react';

import { File } from './file';
import { Table } from './table';

type FileTableProps = {
  files: File[];
  onFileClick?: (ev: React.MouseEvent) => (file: File) => void;
};

const FileTable: React.FC<FileTableProps> = props => {
  return (
    <Table
      onRowClick={props.onFileClick}
      containerWidth={850}
      data={props.files}
      minColWidth={100}
      headerFormatter={header => {
        switch (header) {
          case "modifiedTime":
            return "Modified Time";

          case "absolutePath":
            return "Path";

          case "size":
            return "Size";

          case "type":
            return "Type";

          case "name":
            return "Name";
        }
      }}
    />
  );
};

export default FileTable;
