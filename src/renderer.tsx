import { remote } from 'electron';
import React, { useContext, useState } from 'react';
import { render } from 'react-dom';
import { Box } from 'rebass';

import appMenu from './menu';
import Toolbar from './toolBar';

const fs: typeof import("fs") = remote.require("fs");
const path: typeof import("path") = remote.require("path");

type RendererState = {};
type RendererProps = {};

const Renderer = (props: RendererProps) => {
  const [state, setState] = useState<RendererState>({
    path: __dirname,
    showSearchBar: true,
    searchBarValue: ""
  });
  return (
    <Box>
      <Toolbar />
    </Box>
  );
};

remote.Menu.setApplicationMenu(appMenu());
render(<Renderer />, document.getElementById("root"));
export default Renderer;
