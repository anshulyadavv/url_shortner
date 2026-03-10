import { useState, useRef } from "react";

/**
 * useToast — returns { toast, showToast }
 *
 * Usage:
 *   const { toast, showToast } = useToast();
 *   <Toast message={toast.message} visible={toast.visible} />
 *   showToast("Link copied!");
 */
export function useToast() {
  const [toast, setToast] = useState({ visible: false, message: "" });
  const timer = useRef(null);

  const showToast = (message, duration = 2500) => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ visible: true, message });
    timer.current = setTimeout(
      () => setToast((t) => ({ ...t, visible: false })),
      duration
    );
  };

  return { toast, showToast };
}
