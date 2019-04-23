import { css } from "emotion";
import React from "react";

type Props = {
  onMouseEnter?: React.MouseEventHandler;
  onMouseDown?: React.MouseEventHandler;
  onMouseMove?: React.MouseEventHandler;
  onMouseLeave?: React.MouseEventHandler;
};

export default React.forwardRef<any, Props>(({ ...props }, ref) => {
  return (
    <div
      {...props}
      ref={ref}
      className={css({
        position: "absolute",
        zIndex: 2,
        top: 0,
        right: -2.5,
        cursor: "col-resize",
        background: "black",
        opacity: 0.5,
        width: "2px",
        height: "100%"
      })}
    />
  );
});
