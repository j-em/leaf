import React from 'react';

import { File } from './file';
import { Col, Row, Table } from './table';

type FileTableProps = { files: ReadonlyArray<File> };

const FileTable: React.FC<FileTableProps> = props => {
  const rows = [
    <Row>
      {Object.keys(props.files[0]).map(col => (
        <Col>{col.toString()}</Col>
      ))}
    </Row>,
    ...props.files.map(file => {
      return (
        <Row>
          {Object.values(file).map(value => {
            return <Col>{value.toString()}</Col>;
          })}
        </Row>
      );
    })
  ];
  return <Table>{rows}</Table>;
};

export default FileTable;
