import { useRef } from "react";

export function useObjectiveBoxRefs() {
  const boxEls = useRef<Map<string, HTMLElement>>(new Map());
  const boxRefCallbacks = useRef<Map<string, (el: HTMLElement | null) => void>>(new Map());

  const getBoxRef = (id: string) => {
    let cb = boxRefCallbacks.current.get(id);
    if (!cb) {
      cb = (el: HTMLElement | null) => {
        if (el) boxEls.current.set(id, el);
        else boxEls.current.delete(id);
      };
      boxRefCallbacks.current.set(id, cb);
    }
    return cb;
  };

  return { boxEls, getBoxRef };
}
