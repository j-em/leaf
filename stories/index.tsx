import { storiesOf } from "@storybook/react";
import FileTable from "../src/fileTable";
import SearchBar from "../src/searchBar";
import FileExplorer from "../src/fileExplorer";
import { Kb } from "../src/units";
import { File } from "../src/file";
import { SelectableArea, SelectableItem } from "../src/selectable";
import { Table, Row, Col } from "../src/table";
import defaultTheme from "../src/theme";
import { ThemeProvider } from "emotion-theming";
import { Text, Box } from "@rebass/emotion";

import React from "react";

const createFile = (path: string): File => ({
  name: path,
  type: "file",
  absolutePath: path,
  size: Kb.wrap(10),
  modifiedTime: new Date()
});

const files: Array<File> = [
  "/Users/j-em/project/src/main.ts",
  "/Users/j-em/project/package.json",
  "/Users/j-em/project/src/searchBar.ts"
].map(createFile);

const names = [
  {
    firstName: "Jeremy",
    lastName: "Allard",
    age: 32
  },
  {
    firstName: "Bob",
    lastName: "Allard",
    age: 42
  }
];

storiesOf("Selectable", module).add("default", () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <SelectableArea>
        <SelectableItem>
          <Text>Item1</Text>
        </SelectableItem>
        <SelectableItem>
          <Text>Item2</Text>
        </SelectableItem>
      </SelectableArea>
    </ThemeProvider>
  );
});

storiesOf("Table", module)
  .add("displays list of objects in a table", () => {
    return <Table containerWidth={1000} data={names} minColWidth={20} />;
  })
  .add("displays list of objects in a table with custom headers", () => {
    return (
      <Table
        minColWidth={200}
        containerWidth={1000}
        onRowDoubleClick={row => console.log(row)}
        headerFormatter={header => {
          switch (header) {
            case "age":
              return "Age";

            case "firstName":
              return "First Name";

            case "lastName":
              return "Last Name";
          }
        }}
        data={names}
      />
    );
  });
storiesOf("SearchBar", module).add("while searching", () => <SearchBar onMatchSelect={() => {}} />);
storiesOf("FileTable", module).add("Default", () => (
  <FileTable files={files} />
));