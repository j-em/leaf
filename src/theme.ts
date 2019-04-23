import "@ibm/plex/css/ibm-plex.css";
import { colors } from "@carbon/colors";

import * as _Theme from "@carbon/themes";
type ThemePackage = typeof _Theme.default;

const Theme = (_Theme as unknown) as ThemePackage;

export default {
  colors,
  roles: Theme.themes.g10,
  fonts: {
    sans: "IBM Plex Sans"
  }
};
