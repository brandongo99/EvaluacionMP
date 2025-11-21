import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLoadingBar } from "react-top-loading-bar";

// Este componente maneja la barra de carga en los cambios de ruta
const RouteChangeHandler = () => {
  const location = useLocation();
  const { start, complete } = useLoadingBar();

  useEffect(() => {
    start();
    const timer = setTimeout(() => complete(), 400);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return null;
};

export default RouteChangeHandler;
