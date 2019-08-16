import React from "react";
import { cx, css } from "emotion";

const Spinner: React.FC<{}> = props => {
  return (
    <div className={cx("bx--loading", css({ margin: "auto" }))}>
      <svg className="bx--loading__svg" viewBox="-75 -75 150 150">
        <circle className="bx--loading__stroke" cx="0" cy="0" r="37.5" />
      </svg>
    </div>
  );
};

export default Spinner;
