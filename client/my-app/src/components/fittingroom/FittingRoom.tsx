import React, { useEffect, FC } from "react";
import { Container, Graphics, Sprite } from "pixi.js";
import { usePixi } from "../../pixi/contexts/PixiContext";
import Character from "../character/Character";

const FittingRoom: FC<{ charSprite: Sprite }> = ({ charSprite }) => {
  const { appRef, fittingRoomContainerRef } = usePixi();

  useEffect(() => {
    const setFittingRoomBounds = (fittingRoomContainer: Container) => {
      if (!appRef.current) return;

      const boundary = new Graphics();
      const charWidth = appRef.current.screen.width;
      const charHeight = appRef.current.screen.height * 0.75; // Remaining 80% of the height at the bottom
      boundary.rect(0, 0, charWidth, charHeight);
      boundary.fill({ color: 0xffffff, alpha: 1 });
      boundary.stroke({ width: 2, color: 0xff0000, alpha: 1 });

      fittingRoomContainer.addChild(boundary);
    };

    // Setup the fitting room container
    const setupFittingRoomContainer = (): Container => {
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
      if (fittingRoomContainerRef.current) {
        // Position x to left of canvas (parent)
        fittingRoomContainerRef.current.x = 0;
        // Position y to start at the top of the canvas
        fittingRoomContainerRef.current.y = 0;
        // Positions combination with height and width of container creates a rectangle covering 80% of canvas
      }
    }
  }, [appRef, fittingRoomContainerRef]);

  return <Character charSprite={charSprite} />;
};

export default FittingRoom;
