import { useRef, useState, useEffect } from "react";

const useRect = () => {
  const ref = useRef<Element>();
  const [dimensions, setDimensions] = useState<
    import("./useSelection").Rect
  >();
  useEffect(() => {
    ref.current && setDimensions(ref.current.getBoundingClientRect() as DOMRect);
  }, [ref.current]);
  return { ref, dimensions };
};

export default useRect;
