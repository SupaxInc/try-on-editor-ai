import { useEffect } from "react";
import PropTypes from "prop-types";

import { Container, Graphics, Sprite } from "pixi.js";
import { usePixi } from "../../pixi/contexts/PixiContext";
import { scaleSpriteToFitContainer } from "../../pixi/utils/helper";
import InteractiveSprite from "../../pixi/classes/InteractiveSprite/InteractiveSprite";

// TODO: Make graphics more performant

const Character = ({ charSprite }) => {
  const { appRef, charContainerRef, interactiveCharRef } = usePixi();

  useEffect(() => {
    const setupCharContainer = () => {
      const characterContainer = new Container();
      characterContainer.label = "characterContainer";
      setCharacterBounds(characterContainer);

      return characterContainer;
    };

    // Containers scales its resolution based on its children, so use graphics to create boundaries for character
    const setCharacterBounds = (characterContainer) => {
      const boundary = new Graphics();
      const charWidth = appRef.current.screen.width;
      const charHeight = appRef.current.screen.height * 0.75; // Remaining 80% of the height at the bottom
      boundary.rect(0, 0, charWidth, charHeight);
      boundary.fill({ color: 0xffffff, alpha: 1 });
      boundary.stroke({ width: 2, color: 0xff0000, alpha: 1 });

      characterContainer.addChild(boundary);
    };

    if (appRef.current && !charContainerRef.current) {
      const characterContainer = setupCharContainer();
      appRef.current.stage.addChild(characterContainer);
      charContainerRef.current =
        appRef.current.stage.getChildByLabel("characterContainer");
      // Position x to left of canvas (parent)
      charContainerRef.current.x = 0;
      // Position y to start at the top of the canvas
      charContainerRef.current.y = 0;
      // Positions combination with height and width of container creates a rectangle covering 80% of canvas
    }
  }, [appRef, charContainerRef]);

  useEffect(() => {
    if (!charContainerRef.current) {
      return;
    }

    if (charSprite) {
      charSprite.label = "characterSprite";

      // Move sprite to center of character boundaries
      charSprite.x = charContainerRef.current.width / 2;
      charSprite.y = charContainerRef.current.height / 2;
      scaleSpriteToFitContainer(charSprite, charContainerRef, 50);

      const interactiveChar = new InteractiveSprite(charSprite, {
        draggable: false,
        resizable: false,
      });
      charContainerRef.current.addChild(interactiveChar.getSprite());
      interactiveCharRef.current = interactiveChar;
    }
  }, [charSprite, charContainerRef, interactiveCharRef]);

  return null; // No DOM output
};

Character.propTypes = {
  charSprite: PropTypes.instanceOf(Sprite),
};

export default Character;
