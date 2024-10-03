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

    const charWidth = fittingRoomContainerRef.current.width * 0.5; // 50% of parent width
    const charHeight = fittingRoomContainerRef.current.height * 0.8; // 80% of parent height

    const setCharacterBounds = (characterContainer: NamedContainer) => {
      if (!fittingRoomContainerRef.current) return;

      const boundary = new Graphics();
      boundary.rect(0, 0, charWidth, charHeight);
      boundary.fill({ color: 0x000000, alpha: 0.2 });

      characterContainer.addChild(boundary);
    };

    const setupCharacterContainer = (): NamedContainer => {
      const characterContainer = new Container() as NamedContainer;
      characterContainer.label = "characterContainer";
      setCharacterBounds(characterContainer);

      return characterContainer;
    };

    if (!characterContainerRef.current) {
      const characterContainer = setupCharacterContainer();

      // Center the character container within the fitting room container
      characterContainer.x =
        (fittingRoomContainerRef.current.width - charWidth) / 2;
      characterContainer.y =
        (fittingRoomContainerRef.current.height - charHeight) / 2;

      fittingRoomContainerRef.current.addChild(characterContainer);
      characterContainerRef.current = characterContainer;
    }

    return () => {
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

    scaleSpriteToFitContainer(charSprite, characterContainerRef, 1);
    // Set the anchor point to the center, default is 0,0 which is top left corner
    charSprite.anchor.set(0.5, 0.5);

    charSprite.x = characterContainerRef.current.width / 2;
    charSprite.y = characterContainerRef.current.height / 2;

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
  }, [charSprite, characterContainerRef, interactiveCharRef, appRef]);

  return null; // No DOM output
};

export default Character;
