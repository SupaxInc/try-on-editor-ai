import { useEffect, FC } from "react";
import { scaleSpriteToFitContainer } from "../../pixi/utils/helper";
import InteractiveSprite from "../../pixi/classes/InteractiveSprite/InteractiveSprite";
import { CharacterSprite } from "../../pixi/types";
import { Sprite } from "pixi.js";
import { usePixi } from "../../pixi/contexts/PixiContext";

const Character: FC<{ charSprite: Sprite }> = ({ charSprite }) => {
  const { appRef, fittingRoomContainerRef, interactiveCharRef } = usePixi();

  useEffect(() => {
    if (!fittingRoomContainerRef.current || !appRef.current) {
      return;
    }

    if (charSprite) {
      charSprite.label = "characterSprite";

      // Move sprite to center of character boundaries
      charSprite.x = fittingRoomContainerRef.current.width / 2;
      charSprite.y = fittingRoomContainerRef.current.height / 2;
      scaleSpriteToFitContainer(charSprite, fittingRoomContainerRef, 50);

      const interactiveChar = new InteractiveSprite(
        charSprite as CharacterSprite,
        appRef.current,
        {
          draggable: false,
          resizable: false,
        }
      );
      fittingRoomContainerRef.current.addChild(interactiveChar.getSprite());
      interactiveCharRef.current = interactiveChar;
    }
  }, [charSprite, fittingRoomContainerRef, interactiveCharRef, appRef]);

  return null; // No DOM output
};

export default Character;
