import { useLayoutEffect, useRef, useState } from "react";

const useRect = <T extends HTMLElement>(
  ref: React.MutableRefObject<T | undefined>,
  deps: any[] = []
): DOMRect | undefined => {
  const [state, setState] = useState<DOMRect>();
  useLayoutEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect() as DOMRect;
      setState(rect);
    }
  }, deps);
  return state;
};

export default useRect;
