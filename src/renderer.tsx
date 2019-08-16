import "@ibm/plex/css/ibm-plex.min.css";

import { Box } from "@rebass/emotion";
import { remote } from "electron";
import React, { useContext, useState } from "react";
import { render } from "react-dom";
import FileExplorer from "./fileExplorer";
import SearchBar from "./searchBar";

import appMenu from "./menu";

type RendererState = {};
type RendererProps = {};

const Renderer = (props: RendererProps) => {
  const [cwd, setCwd] = useState("");
  return (
    <Box>
      <SearchBar onMatchSelect={f => setCwd(f.absolutePath)} />
      <FileExplorer path={cwd} />
    </Box>
  );
};

remote.Menu.setApplicationMenu(appMenu());
render(<Renderer />, document.getElementById("root"));
export default Renderer;
