import { Box } from "@rebass/emotion";
import Color from "color";
import { css } from "emotion";
import { withTheme } from "emotion-theming";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";

import useRect from "./useRect";
import useSelection, { Rect } from "./useSelection";

const isElInsideSel = (elBox: Rect, selBox: Rect) => {
  const edges = {
    selBox: { bottom: selBox.top + selBox.height },
    elBox: { bottom: elBox.top + elBox.height }
  };
  return (
    (edges.selBox.bottom >= elBox.top && selBox.top <= edges.elBox.bottom) ||
    (selBox.top <= edges.elBox.bottom && edges.selBox.bottom >= elBox.top)
  );
};

type SelectionBoxProps = {
  height: number;
  width: number;
  left: number;
  top: number;
  theme?: any;
};
const SelectionBox: React.FC<SelectionBoxProps> = withTheme(
  ({ height, width, left, top, theme, ...rest }: SelectionBoxProps) => {
    return (
      <Box
        className={css({
          height,
          width,
          left,
          top,
          position: "absolute",
          backgroundColor: Color(theme.colors.gray50)
            .alpha(0.3)
            .toString(),
          border: `1px solid ${theme.colors.gray30}`
        })}
      />
    );
  }
);

type SelectableItemProps = {
  children: React.ReactElement;
  onClick?: () => void;
  onSelect?: () => void;
  onUnselect?: () => void;
};

export const SelectableItem: React.FC<SelectableItemProps> = props => {
  const { ref, dimensions } = useRect();
  const selectionRect = useSelection();

  const isSelected =
    selectionRect && dimensions && isElInsideSel(dimensions, selectionRect);

  const isSelecting = selectionRect !== undefined;

  useEffect(() => {
    if (isSelected) {
      props.onSelect && props.onSelect();
    } else {
      isSelecting && props.onUnselect && props.onUnselect();
    }
  }, [isSelected, isSelecting]);
  return (
    <Box ref={ref} onClick={props.onClick}>
      {props.children}
    </Box>
  );
};

type SelectableArea = {};

export const SelectableArea: React.FC<SelectableArea> = ({ children }) => {
  const selectionRect = useSelection();
  const style = css({ userSelect: "none" });
  return (
    <Box className={style}>
      {selectionRect && <SelectionBox {...selectionRect} />}
      {children}
    </Box>
  );
};
