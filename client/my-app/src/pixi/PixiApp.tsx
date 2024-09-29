import React, { useRef, useEffect, useState, ReactNode } from "react";
import { Application } from "pixi.js";
import { usePixi } from "./contexts/PixiContext";

const PixiApp: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { appRef } = usePixi();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const renderApp = async () => {
      const app = new Application();
      await app.init({
        width: 900,
        height: 900,
        backgroundColor: 0x1099bb,
      });

      // Only append canvas when app is ready to be initialized
      if (!appRef.current && containerRef.current) {
        containerRef.current.appendChild(app.canvas);
        appRef.current = app;
        (window as any).__PIXI_APP__ = app; // TODO: Remove when debugging on PixiJS extension is done
        setIsReady(true); // TODO: Add a spinner here
      }
    };

    renderApp();

    return () => {
      if (appRef.current) {
        appRef.current.destroy(true);
        appRef.current = null;
      }
    };
  }, []); // Empty dependency array since refs don't trigger re-renders

  return <div ref={containerRef}>{isReady ? children : null}</div>;
};

export default PixiApp;
