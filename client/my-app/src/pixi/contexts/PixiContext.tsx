import React, {
  createContext,
  useContext,
  useRef,
  ReactNode,
  MutableRefObject,
} from "react";
import { Application, Container } from "pixi.js";
import InteractiveSprite from "../classes/InteractiveSprite/InteractiveSprite";
import { NamedContainer } from "../types";

interface PixiContextType {
  appRef: MutableRefObject<Application | null>;
  fittingRoomContainerRef: MutableRefObject<NamedContainer | null>;
  characterContainerRef: MutableRefObject<NamedContainer | null>;
  interactiveCharRef: MutableRefObject<InteractiveSprite | null>;
  wardrobeContainerRef: MutableRefObject<NamedContainer | null>;
  itemsContainerRef: MutableRefObject<NamedContainer | null>;
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
  const fittingRoomContainerRef = useRef<NamedContainer>(null);
  const wardrobeContainerRef = useRef<NamedContainer>(null);
  const itemsContainerRef = useRef<NamedContainer>(null);

  const characterContainerRef = useRef<NamedContainer>(null);
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
