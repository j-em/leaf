import {
  Reducer,
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState
} from "react";

export type MousePosition = { x: number; y: number };

type MouseAction =
  | { type: "setMouseDown"; at: MousePosition }
  | { type: "setMouseUp"; at: MousePosition }
  | {
      type: "setMouseMove";
      at: MousePosition;
    };

type MouseState = {
  status:
    | "down"
    | "up"
    | "pristine"
    | "dragStart"
    | "dragEnd"
    | "move"
    | "drag";
  at: MousePosition;
};

const useMouseButton = (button: number) => {
  const [isPressed, setPressed] = useState<boolean>(false);
  const onMouseDown = useCallback((ev: MouseEvent) => {
    return ev.button === button ? setPressed(true) : setPressed(false);
  }, []);

  const onMouseUp = useCallback((ev: MouseEvent) => {
    return ev.button === button ? setPressed(false) : setPressed(true);
  }, []);

  useLayoutEffect(() => {
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return isPressed;
};

const useMousePosition = () => {
  const [currentPos, setCurrentPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0
  });
  const [lastPos, setLastPos] = useState(currentPos);

  const onMouseMove = (ev: MouseEvent) =>
    setCurrentPos({ x: ev.clientX, y: ev.clientY });

  useLayoutEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return currentPos;
};

type MouseDirection = "top" | "right" | "bottom" | "left";
const useMouseDirection = () => {
  const mousePos = useMousePosition();
  const lastMousePos = useRef(mousePos);

  const [direction, setDirection] = useState<MouseDirection>();

  useLayoutEffect(() => {
    if (mousePos.x > lastMousePos.current.x) {
      setDirection("right");
    } else if (mousePos.x < lastMousePos.current.x) {
      setDirection("left");
    }
    lastMousePos.current = mousePos;
  }, [mousePos]);

  return direction;
};

export { useMouseButton, useMousePosition, useMouseDirection };
