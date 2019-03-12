import { app, BrowserWindow } from "electron";

import path from "path";

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600
  });
  const rendererPath = path.resolve(__dirname, "index.html");
  win.webContents.openDevTools();
  win.loadURL(`file://${rendererPath}`);
}

app.on("ready", () => {
  createWindow();
});
