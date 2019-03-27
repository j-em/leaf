import useMouseStatus, { MousePosition } from "./useMouseStatus";

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

const useSelection: () => Rect | undefined = () => {
  const mouseStatus = useMouseStatus();
  if (mouseStatus.status === "drag") {
    return calcBox(mouseStatus.from, mouseStatus.to);
  }
};

export default useSelection;
