import { useEffect } from "react";
import { createPortal } from "react-dom";

/**
 * Centred overlay dialog, rendered into <body> via a portal.
 *
 * The portal is load-bearing. The site header carries `backdrop-blur-md`, and
 * an element with a backdrop-filter becomes the containing block *and* the
 * stacking context for its position:fixed descendants — so an overlay rendered
 * inside the header is positioned against the header's own box and can never
 * rise above anything painted outside it. Portalling to <body> sidesteps both.
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
    <div
      className="modal-scrim"
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      {children}
    </div>,
    document.body
  );
};

export default Modal;
