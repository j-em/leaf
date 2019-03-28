import { remote } from "electron";

const createMenu: () => Electron.Menu = () =>
  remote.Menu.buildFromTemplate([
    {
      label: remote.app.getName(),
      submenu: [
        {
          label: `About ${remote.app.getName()}`
        }
      ]
    },
    {
      label: "File",
      submenu: [
        {
          label: "New Folder"
        },
        {
          label: "New File"
        }
      ]
    },
    {
      label: "Edit",
      submenu: [
        {
          label: "Cut"
        },
        {
          label: "Copy"
        },
        {
          label: "Paste"
        }
      ]
    },
    {
      role: "help",
      submenu: [
        {
          label: "Reload",
          accelerator: "CmdOrCtrl+Shift+R",
          click() {
            remote.getCurrentWindow().reload();
          }
        },
        {
          label: "Get Help",
          click() {
            remote.shell.openExternal("https://jeremyallard.dev/leaf");
          }
        }
      ]
    }
  ]);

export default createMenu;
