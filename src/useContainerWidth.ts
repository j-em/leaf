import { useLayoutEffect, useRef, useState } from 'react';

const useContainerWidth = () => {
  const ref = useRef<HTMLElement>(null);
  const [width, setWidth] = useState<number>(0);

  useLayoutEffect(() => {
    if (ref.current) {
      setWidth(ref.current.clientWidth);
    }
  }, []);

  return [width, ref] as const;
};
export default useContainerWidth;
