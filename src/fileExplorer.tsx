import React, { useState } from "react";
import FileTable from "../src/fileTable";
import { File } from "./file";
import SearchBar from "./searchBar";
import { Flex, Box } from "@rebass/emotion";

type Props = { files: ReadonlyArray<File> };
export default (props: Props) => {
  const [searchBarInput, setSearchBarInput] = useState("");
  return (
    <Box>
      <SearchBar value={searchBarInput} onChange={setSearchBarInput} />
      <FileTable files={props.files} />
    </Box>
  );
};
