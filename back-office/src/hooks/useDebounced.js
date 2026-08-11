import { useEffect, useState } from "react";

/**
 * Returns `value` only after it has stopped changing for `delay` ms.
 *
 * Search boxes are bound to state that changes on every keystroke; without
 * this, typing "painting" fires eight API requests and the list flickers
 * through eight renders. Debouncing collapses that to one.
 */
export const useDebounced = (value, delay = 350) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

export default useDebounced;
