import React, {
  createContext,
  useContext,
  useRef,
  ReactNode,
  MutableRefObject,
} from "react";
import { Application, Container } from "pixi.js";
import InteractiveSprite from "../classes/InteractiveSprite/InteractiveSprite";

interface PixiContextType {
  appRef: MutableRefObject<Application | null>;
  charContainerRef: MutableRefObject<Container | null>;
  interactiveCharRef: MutableRefObject<InteractiveSprite | null>;
  fittingRoomContainerRef: MutableRefObject<Container | null>;
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
  const fittingRoomContainerRef = useRef<Container>(null);
  const itemsContainerRef = useRef<Container>(null);
  const interactiveCharRef = useRef<InteractiveSprite>(null);
  return (
    <PixiContext.Provider
      value={{
        appRef,
        charContainerRef,
        fittingRoomContainerRef,
        itemsContainerRef,
        interactiveCharRef,
      }}
    >
      {children}
    </PixiContext.Provider>
  );
};
