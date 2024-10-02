import { useEffect, FC } from "react";
import { scaleSpriteToFitContainer } from "../../pixi/utils/helper";
import InteractiveSprite from "../../pixi/classes/InteractiveSprite/InteractiveSprite";
import { CharacterSprite, NamedContainer } from "../../pixi/types";
import { Container, Graphics, Sprite } from "pixi.js";
import { usePixi } from "../../pixi/contexts/PixiContext";

const Character: FC<{ charSprite: Sprite }> = ({ charSprite }) => {
  const {
    appRef,
    fittingRoomContainerRef,
    characterContainerRef,
    interactiveCharRef,
  } = usePixi();

  useEffect(() => {
    if (!charSprite || !fittingRoomContainerRef.current) return;

    const setCharacterBounds = (characterContainer: NamedContainer) => {
      const boundary = new Graphics();
      const charWidth = charSprite.width;
      const charHeight = charSprite.height;
      boundary.rect(0, 0, charWidth, charHeight);
      boundary.fill({ color: 0x000000, alpha: 0.2 });

      characterContainer.addChild(boundary);
    };

    // Setup the fitting room container
    const setupCharacterContainer = (): NamedContainer => {
      const characterContainer = new Container() as NamedContainer;
      characterContainer.label = "characterContainer";
      setCharacterBounds(characterContainer);

      return characterContainer;
    };

    if (!characterContainerRef.current) {
      const characterContainer = setupCharacterContainer();
      fittingRoomContainerRef.current.addChild(characterContainer);
      characterContainerRef.current = characterContainer;

      characterContainerRef.current.x = 0;
      characterContainerRef.current.y = 0;
    }

    return () => {
      // No need to destroy items container or item sprites as its children of wardrobe container
      if (characterContainerRef.current) {
        characterContainerRef.current.destroy({ children: true });
        characterContainerRef.current = null;
      }
    };
  }, [fittingRoomContainerRef, characterContainerRef, charSprite]);

  useEffect(() => {
    if (!characterContainerRef.current || !appRef.current) {
      return;
    }
    scaleSpriteToFitContainer(charSprite, fittingRoomContainerRef, 50);
    charSprite.x = characterContainerRef.current.width;
    charSprite.y = characterContainerRef.current.height;

    const interactiveChar = new InteractiveSprite(
      characterContainerRef.current,
      charSprite as CharacterSprite,
      appRef.current,
      {
        draggable: false,
        resizable: false,
      }
    );

    characterContainerRef.current.addChild(interactiveChar.getSprite());
    interactiveCharRef.current = interactiveChar;
  }, [charSprite, fittingRoomContainerRef, interactiveCharRef, appRef]);

  return null; // No DOM output
};

export default Character;
