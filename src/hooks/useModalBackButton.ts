import { useEffect, useRef } from "react";

// Global stack of currently open modal refs
const modalStack: { current: () => void }[] = [];

let popStateListenerAdded = false;

const handlePopState = () => {
  if (modalStack.length > 0) {
    const topModalRef = modalStack.pop();
    if (topModalRef && topModalRef.current) {
      topModalRef.current();
    }
  }
};

export function useModalBackButton(isOpen: boolean, onClose: () => void) {
  const isPushedRef = useRef(false);
  const onCloseRef = useRef(onClose);

  // Keep the ref up to date with the latest onClose callback
  onCloseRef.current = onClose;

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!popStateListenerAdded) {
      window.addEventListener("popstate", handlePopState);
      popStateListenerAdded = true;
    }

    if (isOpen) {
      if (!isPushedRef.current) {
        window.history.pushState({ modalOpen: true }, "");
        modalStack.push(onCloseRef);
        isPushedRef.current = true;
      }
    } else {
      if (isPushedRef.current) {
        isPushedRef.current = false;
        const index = modalStack.indexOf(onCloseRef);
        if (index !== -1) {
          modalStack.splice(index, 1);
        }
        if (window.history.state?.modalOpen) {
          window.history.back();
        }
      }
    }

    return () => {
      if (isPushedRef.current) {
        isPushedRef.current = false;
        const index = modalStack.indexOf(onCloseRef);
        if (index !== -1) {
          modalStack.splice(index, 1);
        }
        if (window.history.state?.modalOpen) {
          window.history.back();
        }
      }
    };
  }, [isOpen]);
}
