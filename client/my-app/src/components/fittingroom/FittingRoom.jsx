import { useEffect } from "react";
import PropTypes from "prop-types";

import { Container, Graphics, Sprite } from "pixi.js";
import { usePixi } from "../../pixi/contexts/PixiContext";
import { scaleSpriteToFitContainer } from "../../pixi/utils/helper";
import InteractiveSprite from "../../pixi/classes/InteractiveSprite/InteractiveSprite";

// TODO: Make graphics more performant

const FittingRoom = ({ charSprite }) => {
  const { appRef, fittingRoomContainerRef, interactiveCharRef } = usePixi();

  useEffect(() => {
    // Containers scales its resolution based on its children, so use graphics to create boundaries for Fitting Room
    const setFittingRoomBounds = (fittingRoomContainer) => {
      const boundary = new Graphics();
      const charWidth = appRef.current.screen.width;
      const charHeight = appRef.current.screen.height * 0.75; // Remaining 80% of the height at the bottom
      boundary.rect(0, 0, charWidth, charHeight);
      boundary.fill({ color: 0xffffff, alpha: 1 });
      boundary.stroke({ width: 2, color: 0xff0000, alpha: 1 });

      fittingRoomContainer.addChild(boundary);
    };

    const setupFittingRoomContainer = () => {
      const fittingRoomContainer = new Container();
      fittingRoomContainer.label = "fittingRoomContainer";
      setFittingRoomBounds(fittingRoomContainer);

      return fittingRoomContainer;
    };

    if (appRef.current && !fittingRoomContainerRef.current) {
      const fittingRoomContainer = setupFittingRoomContainer();
      appRef.current.stage.addChild(fittingRoomContainer);
      fittingRoomContainerRef.current = appRef.current.stage.getChildByLabel(
        "fittingRoomContainer"
      );
      // Position x to left of canvas (parent)
      fittingRoomContainerRef.current.x = 0;
      // Position y to start at the top of the canvas
      fittingRoomContainerRef.current.y = 0;
      // Positions combination with height and width of container creates a rectangle covering 80% of canvas
    }
  }, [appRef, fittingRoomContainerRef]);

  useEffect(() => {
    if (!fittingRoomContainerRef.current) {
      return;
    }

    if (charSprite) {
      charSprite.label = "characterSprite";

      // Move sprite to center of character boundaries
      charSprite.x = fittingRoomContainerRef.current.width / 2;
      charSprite.y = fittingRoomContainerRef.current.height / 2;
      scaleSpriteToFitContainer(charSprite, fittingRoomContainerRef, 50);

      const interactiveChar = new InteractiveSprite(charSprite, {
        draggable: false,
        resizable: false,
      });
      fittingRoomContainerRef.current.addChild(interactiveChar.getSprite());
      interactiveCharRef.current = interactiveChar;
    }
  }, [charSprite, fittingRoomContainerRef, interactiveCharRef]);

  return null; // No DOM output
};

FittingRoom.propTypes = {
  charSprite: PropTypes.instanceOf(Sprite),
};

export default FittingRoom;
