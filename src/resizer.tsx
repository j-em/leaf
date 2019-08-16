import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from "react";

import { useMouseButton, useMousePosition } from "./useMouse";

type Props = {
  onResize: (newWidth: number) => void;
  currentWidth: number;
  minWidth: number;
  colId: string;
};

export default React.memo(function Resizer(props: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const [isResizing, setIsResizing] = useState(false);

  const isMousePressed = useMouseButton(0);

  const mousePos = useMousePosition();

  const onMouseDown = useCallback<React.MouseEventHandler>(
    e => setIsResizing(true),
    []
  );

  useEffect(() => {
    if (!isMousePressed) {
      setIsResizing(false);
    }
  }, [isMousePressed]);

  useEffect(() => {
    if (isResizing) {
      const dimensions =
        ref.current && (ref.current.getBoundingClientRect() as DOMRect);
      if (dimensions) {
        const gap = (mousePos.x - dimensions.x) - (dimensions.width / 2);
        const newWidth = props.currentWidth + gap;

        if (newWidth >= props.minWidth) {
          props.onResize(newWidth);
        } else {
          props.onResize(props.minWidth);
        }
      }
    }
  }, [isResizing && mousePos]);
  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      style={{
        position: "absolute",
        zIndex: 2,
        top: 0,
        right: 0,
        cursor: "col-resize",
        background: "transparent",
        opacity: 0.5,
        width: "2px",
        height: "100%"
      }}
    />
  );
});
