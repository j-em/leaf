import {
  Reducer,
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState
} from "react";

import { fromEvent } from "rxjs";
import { auditTime } from "rxjs/operators"

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
  const [currentPos, setCurrentPos] = useState<{
    x: number;
    y: number;
    movementX: number;
  }>({
    x: 0,
    y: 0,
    movementX: 0
  });

    useEffect(() => {
      const events = (fromEvent<MouseEvent>(window, "mousemove"));

      const subscription = events.subscribe(next => {
        setCurrentPos(prevPos =>
          next.clientX - prevPos.x !== 0
            ? {
                x: next.clientX,
                y: next.clientY,
                movementX: next.clientX - prevPos.x
              }
            : prevPos
        );
      });

      return () => {
        subscription.unsubscribe();
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
