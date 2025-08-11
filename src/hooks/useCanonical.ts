import { useLocation } from "react-router-dom";
import { useMemo } from "react";

export const useCanonical = () => {
  const { pathname, search } = useLocation();
  return useMemo(() => `${window.location.origin}${pathname}${search}`, [pathname, search]);
};
