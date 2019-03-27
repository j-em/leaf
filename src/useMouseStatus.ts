import { useState, useLayoutEffect, useEffect } from "react";

export type MousePosition = { x: number; y: number };

type MouseStatus =
  | {
      status: "down" | "move" | "up";
      at: MousePosition;
    }
  | { status: "drag"; from: MousePosition; to: MousePosition };

const useMouseStatus = () => {
  const [mouseStatus, setMouseStatus] = useState<MouseStatus>({
    status: "up",
    at: { x: 0, y: 0 }
  });

  useEffect(() => {
    function onMouseUp(ev: MouseEvent) {
      setMouseStatus({ status: "up", at: { x: ev.pageX, y: ev.pageY } });
    }

    function onMouseDown(ev: MouseEvent) {
      setMouseStatus({ status: "down", at: { x: ev.pageX, y: ev.pageY } });
    }

    function onMouseMove(ev: MouseEvent) {
      setMouseStatus(prevStatus => {
        switch (prevStatus.status) {
          case "down":
            return {
              status: "drag",
              from: { x: ev.pageX, y: ev.pageY },
              to: { x: ev.pageX, y: ev.pageY }
            };

          case "drag":
            return {
              status: "drag",
              from: prevStatus.from,
              to: { x: ev.pageX, y: ev.pageY }
            };

          default:
            return prevStatus;
        }
      });
    }

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);
  return mouseStatus;
};

export default useMouseStatus;
