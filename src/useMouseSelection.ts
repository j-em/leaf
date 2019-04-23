import { useMouseButton, useMousePosition, MousePosition } from "./useMouse";
import { useState, useEffect, useMemo } from "react";

export type Rect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const calcBox: (initial: MousePosition, current: MousePosition) => Rect = (
  initialPos,
  currentPos
) => {
  const width =
    currentPos.x > initialPos.x
      ? currentPos.x - initialPos.x
      : initialPos.x - currentPos.x;

  const height =
    currentPos.y > initialPos.y
      ? currentPos.y - initialPos.y
      : initialPos.y - currentPos.y;

  const top = currentPos.y > initialPos.y ? initialPos.y : currentPos.y;
  const left = currentPos.x > initialPos.x ? initialPos.x : currentPos.x;

  return { width, height, top, left };
};

const useMouseBox: () => Rect | undefined = () => {
  const mousePressed = useMouseButton(0);
  const mousePos = useMousePosition();

  const [startPos, setStartPos] = useState<MousePosition>();

  const calcBoxFn = useMemo(() => calcBox, [startPos, mousePos]);

  useEffect(() => {
    if (mousePressed && !startPos) {
      setStartPos(mousePos);
    } else if (!mousePressed) {
      setStartPos(undefined);
    }
  }, [mousePressed, mousePos]);

  return startPos && calcBoxFn(startPos, mousePos);
};

export default useMouseBox;
