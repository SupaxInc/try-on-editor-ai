import React, {
  createContext,
  useContext,
  useRef,
  ReactNode,
  MutableRefObject,
} from "react";
import { Application, Container } from "pixi.js";

interface PixiContextType {
  appRef: MutableRefObject<Application | null>;
  charContainerRef: MutableRefObject<Container | null>;
  wardrobeContainerRef: MutableRefObject<Container | null>;
  itemsContainerRef: MutableRefObject<Container | null>;
}

const PixiContext = createContext<PixiContextType | undefined>(undefined);

export const usePixi = (): PixiContextType => {
  const context = useContext(PixiContext);
  if (!context) {
    throw new Error("usePixi must be used within a PixiProvider");
  }
  return context;
};

interface PixiProviderProps {
  children: ReactNode;
}

export const PixiProvider: React.FC<PixiProviderProps> = ({ children }) => {
  const appRef = useRef<Application>(null);
  const charContainerRef = useRef<Container>(null);
  const wardrobeContainerRef = useRef<Container>(null);
  const itemsContainerRef = useRef<Container>(null);

  return (
    <PixiContext.Provider
      value={{
        appRef,
        charContainerRef,
        wardrobeContainerRef,
        itemsContainerRef,
      }}
    >
      {children}
    </PixiContext.Provider>
  );
};
