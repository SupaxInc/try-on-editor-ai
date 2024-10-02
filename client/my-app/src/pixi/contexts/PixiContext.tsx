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
  fittingRoomContainerRef: MutableRefObject<Container | null>;
  characterContainerRef: MutableRefObject<Container | null>;
  interactiveCharRef: MutableRefObject<InteractiveSprite | null>;
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
  const fittingRoomContainerRef = useRef<Container>(null);
  const wardrobeContainerRef = useRef<Container>(null);
  const itemsContainerRef = useRef<Container>(null);

  const characterContainerRef = useRef<Container>(null);
  const interactiveCharRef = useRef<InteractiveSprite>(null);

  return (
    <PixiContext.Provider
      value={{
        appRef,
        fittingRoomContainerRef,
        characterContainerRef,
        wardrobeContainerRef,
        itemsContainerRef,
        interactiveCharRef,
      }}
    >
      {children}
    </PixiContext.Provider>
  );
};
