import React, { useEffect, FC } from "react";
import { Container, Graphics, Sprite } from "pixi.js";
import { usePixi } from "../../pixi/contexts/PixiContext";
import Character from "../character/Character";
import { NamedContainer } from "../../pixi/types";

const FittingRoom: FC<{ charSprite: Sprite }> = ({ charSprite }) => {
  const { appRef, fittingRoomContainerRef } = usePixi();

  useEffect(() => {
    const setFittingRoomBounds = (fittingRoomContainer: NamedContainer) => {
      if (!appRef.current) return;

      const boundary = new Graphics();
      const fittingRoomWidth = appRef.current.screen.width;
      const fittingRoomHeight = appRef.current.screen.height * 0.75; // Remaining 80% of the height at the bottom
      boundary.rect(0, 0, fittingRoomWidth, fittingRoomHeight);
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

      fittingRoomContainerRef.current = fittingRoomContainer;
      if (fittingRoomContainerRef.current) {
        // (0,0) origin is top left of canvas, imagine the fitting rectangle where origin is top left (0,0)
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
