import React, { useEffect, useRef, FC } from "react";
import { Application, Container, Graphics, Sprite } from "pixi.js";
import { usePixi } from "../../pixi/contexts/PixiContext";
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
} from "../../pixi/types";

const Items: FC<{ itemSprites: Sprite[] }> = ({ itemSprites }) => {
  const { appRef, itemsContainerRef, interactiveCharRef } = usePixi();

  const totalItemsWidthRef = useRef<number>(0);

  /* Setting up Items and Adding Items to the Fitting Room */
  useEffect(() => {
    const setItemContainerBounds = (itemContainer: NamedContainer) => {
      const desiredWidth = 150; // Adjust as needed
      const desiredHeight = 150; // Adjust as needed
      const boundary = new Graphics();
      boundary.rect(0, 0, desiredWidth, desiredHeight);
      boundary.fill({ color: 0x000000 });

      itemContainer.addChild(boundary);
    };

    const setupItemContainer = (
      index: number,
      sprite: ItemSprite
    ): NamedContainer => {
      const itemContainer = new Container() as NamedContainer;
      itemContainer.label = `itemContainer_${index}`;

      setItemContainerBounds(itemContainer);

      itemContainer.addChild(sprite);

      return itemContainer;
    };

    if (!itemsContainerRef.current || itemSprites.length === 0) {
      return;
    }

    const newItemSprite = itemSprites[itemSprites.length - 1] as ItemSprite;
    // TODO: I need to make UI changes to make sure that char sprite is added first before items
    const characterSprite =
      interactiveCharRef.current?.getSprite() as CharacterSprite;

    if (!characterSprite || !appRef.current) {
      console.warn("No character sprite or app ref");
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
      itemsContainerRef.current,
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
            if (!interactiveCharRef.current) {
              console.warn("No character sprite");
              return null;
            }

            interactiveCharRef.current.setLoading(true);

            const newSprite = await onDropOnSpriteTryOn(
              characterSprite,
              droppedSprite,
              triggerTryOn,
              app
            );
            interactiveCharRef.current.setLoading(false);
            return newSprite;
          } catch (error) {
            console.log("Error onDropOnSpriteTryOn");
            console.error(error);
          }

          return null;
        },
      }
    );

    itemsContainerRef.current.addChild(newInteractiveItem.getSprite());

    // Increase total items width to account for new sprites
    totalItemsWidthRef.current += newPositionX;
  }, [itemSprites, itemsContainerRef, appRef]);

  return null;
};

export default Items;
