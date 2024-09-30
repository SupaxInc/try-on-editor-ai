import React, { useEffect, useRef } from "react";
import { Application, Container, Graphics, Sprite } from "pixi.js";
import { usePixi } from "../../pixi/contexts/PixiContext.tsx";
import {
  isOnTopOfSprite,
  onDropResetToInitial,
  onDropOnSpriteTryOn,
} from "../../pixi/utils/interactions.ts";
import { scaleSpriteToFitContainer } from "../../pixi/utils/helper.ts";
import { triggerTryOn } from "../../api.js";
import InteractiveSprite from "../../pixi/classes/InteractiveSprite/InteractiveSprite.ts";
import {
  NamedContainer,
  ItemSprite,
  CharacterSprite,
  AllSetupSprites,
} from "../../pixi/types.ts";

const FittingRoom: React.FC<{ itemSprites: Sprite[] }> = ({ itemSprites }) => {
  const {
    fittingRoomContainerRef,
    appRef,
    itemsContainerRef,
    charContainerRef,
    interactiveCharRef,
  } = usePixi();

  const totalItemsWidthRef = useRef<number>(0);

  /* Setting up the Fitting Room and Items Containers */
  useEffect(() => {
    // Containers scales its resolution based on its children, so use graphics to create boundaries for wardrobe
    const setFittingRoomBounds = (fittingRoomContainer: NamedContainer) => {
      if (!appRef.current) return;

      const boundary = new Graphics();
      const wardrobeWidth = appRef.current.screen.width; // Full width of app canvas
      const wardrobeHeight = appRef.current.screen.height * 0.25; // Remaining 25% of the height at the bottom

      boundary.rect(0, 0, wardrobeWidth, wardrobeHeight);
      boundary.fill({ color: 0x333333 });

      fittingRoomContainer.addChild(boundary);
    };

    const setupFittingRoomContainer = (): NamedContainer => {
      const fittingRoomContainer = new Container() as NamedContainer;
      fittingRoomContainer.label = "fittingRoomContainer";
      setFittingRoomBounds(fittingRoomContainer);
      return fittingRoomContainer;
    };

    // Containers scales its resolution based on its children, so use graphics to create boundaries for items
    const setItemsBounds = (itemsContainer: NamedContainer) => {
      if (!fittingRoomContainerRef.current) return;

      const boundary = new Graphics();
      const itemsWidth = fittingRoomContainerRef.current.width;
      const itemsHeight = fittingRoomContainerRef.current.height * 0.8;

      boundary.rect(0, 0, itemsWidth, itemsHeight);
      boundary.fill({ color: 0x000000 });

      itemsContainer.addChild(boundary);
    };

    const setupItemsContainer = (): NamedContainer => {
      const itemsContainer = new Container() as NamedContainer;
      itemsContainer.label = "itemsContainer";
      setItemsBounds(itemsContainer);
      return itemsContainer;
    };

    if (!appRef.current) {
      return;
    }

    /* Setup Wardrobe container */
    if (!fittingRoomContainerRef.current) {
      const fittingRoomContainer = setupFittingRoomContainer();
      appRef.current.stage.addChild(fittingRoomContainer);
      fittingRoomContainerRef.current = fittingRoomContainer;
      // (0,0) origin is top left of canvas, imagine the wardrobe rectangle where origin is top left (0,0)
      fittingRoomContainerRef.current.x = 0; // Position x to start at left of canvas

      // Position y to start at wardrobe height - the app canvas's screen height, so it starts 80% of screen
      fittingRoomContainerRef.current.y =
        appRef.current.screen.height - fittingRoomContainerRef.current.height;
    }

    /* Setup Items Container */
    if (!itemsContainerRef.current) {
      const itemsContainer = setupItemsContainer();
      fittingRoomContainerRef.current.addChild(itemsContainer);
      itemsContainerRef.current = itemsContainer;

      // Position at top left of wardrobe container
      itemsContainerRef.current.x = 0;
      itemsContainerRef.current.y = 0;
    }

    return () => {
      // No need to destroy items container or item sprites as its children of wardrobe container
      if (fittingRoomContainerRef.current) {
        fittingRoomContainerRef.current.destroy({ children: true });
        fittingRoomContainerRef.current = null;
        itemsContainerRef.current = null;
      }
    };
  }, [appRef, fittingRoomContainerRef, itemsContainerRef]);

  /* Setting up Items and Adding Items to the Fitting Room */
  useEffect(() => {
    if (!itemsContainerRef.current || itemSprites.length === 0) {
      return;
    }

    const newItemSprite = itemSprites[itemSprites.length - 1] as ItemSprite;
    const characterSprite = charContainerRef.current?.children.find(
      (child) => (child as Sprite).label === "characterSprite"
    ) as CharacterSprite;

    if (!characterSprite || !appRef.current) {
      return;
    }

    // Scale the sprite to container before positioning calculations
    scaleSpriteToFitContainer(newItemSprite, itemsContainerRef, 15);

    const itemSpacing = 200;
    const newPositionX =
      itemSprites.length > 1 ? totalItemsWidthRef.current + itemSpacing : 150;
    newItemSprite.x = newPositionX;
    newItemSprite.y = itemsContainerRef.current.height / 2; // Middle of the items container

    // Storing new initialX and initialY properties to sprite object to be used for onDropResetToInitial
    newItemSprite.initialX = newPositionX;
    newItemSprite.initialY = itemsContainerRef.current.height / 2; // Middle of the items container

    const newInteractiveItem = new InteractiveSprite(
      newItemSprite,
      appRef.current,
      {
        resizable: false,
        droppable: true,
        onDropResetToInitial,
        isOnTopOfSprite,
        targetSprite: characterSprite,
        onDropOnSprite: async (
          droppedSprite: AllSetupSprites,
          app: Application
        ) => {
          try {
            interactiveCharRef.current?.setLoading(true);

            const newSprite = await onDropOnSpriteTryOn(
              characterSprite,
              droppedSprite,
              triggerTryOn,
              app
            );
            interactiveCharRef.current?.setLoading(false);
            return newSprite;
          } catch (error) {
            console.error(error);
          } finally {
            interactiveCharRef.current?.setLoading(false);
          }

          return null;
        },
      }
    );

    itemsContainerRef.current.addChild(newInteractiveItem.getSprite());

    // Increase total items width to account for new sprites
    totalItemsWidthRef.current += newPositionX;
  }, [itemSprites, itemsContainerRef, charContainerRef, appRef]);

  return null; // No DOM output
};

export default FittingRoom;
