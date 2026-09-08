import { useEffect } from "react";
import { createPortal } from "react-dom";

/**
 * Centred overlay dialog, rendered into <body> via a portal.
 *
 * The portal is load-bearing, not a nicety. Every admin page wraps its content
 * in `animate-fade-up`, and that animation's `fill-mode: both` permanently
 * leaves `transform: translateY(0)` on the wrapper. Any transform other than
 * `none` makes an element the containing block for its position:fixed
 * descendants — so a scrim rendered inline is sized and positioned against the
 * page's content box instead of the viewport, leaving the sidebar, header and
 * the space below the table undimmed. Portalling to <body> puts the scrim
 * outside every transformed ancestor, so it always covers the whole viewport.
 */
const Modal = ({ onClose, label, children }) => {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return createPortal(
    <div className="modal-scrim" role="dialog" aria-modal="true" aria-label={label}>
      {children}
    </div>,
    document.body
  );
};

export default Modal;
