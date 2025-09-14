import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHash({ offset = 80 }) {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
      // optional: focus for a11y
      el.focus?.();
    }
  }, [location, offset]);

  return null;
}