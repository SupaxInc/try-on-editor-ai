import React, { useEffect, FC } from "react";
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
  const {
    appRef,
    itemsContainerRef,
    interactiveCharRef,
    itemContainersRef,
    characterContainerRef,
  } = usePixi();

  useEffect(() => {
    if (!itemsContainerRef.current || itemSprites.length === 0) {
      return;
    }

    const index = itemSprites.length - 1;
    const newItemSprite = itemSprites[index] as ItemSprite;

    const setItemContainerBounds = (itemContainer: NamedContainer) => {
      const itemWidth = 150;
      const itemHeight = 150;

      const boundary = new Graphics();
      boundary.rect(0, 0, itemWidth, itemHeight);
      boundary.fill({ color: 0x000000 });

      // **Always add boundary to the container first so we can begin to position and control dimensions of container**
      itemContainer.addChild(boundary);
    };

    const setupItemContainer = (): NamedContainer => {
      const itemContainer = new Container() as NamedContainer;
      itemContainer.label = `itemContainer_${index}`;
      setItemContainerBounds(itemContainer);
      return itemContainer;
    };

    const itemContainer = setupItemContainer();

    scaleSpriteToFitContainer(newItemSprite, itemContainer);

    // Center the item sprite within the item container
    newItemSprite.anchor.set(0.5, 0.5);
    newItemSprite.x = itemContainer.width / 2;
    newItemSprite.y = itemContainer.height / 2;
    newItemSprite.initialX = newItemSprite.x;
    newItemSprite.initialY = newItemSprite.y;

    itemContainer.addChild(newItemSprite);

    // Calculate the positions of the item on the items container
    const itemSpacing = 20;
    itemContainer.x = index * (itemContainer.width + itemSpacing);
    itemContainer.y =
      (itemsContainerRef.current.height - itemContainer.height) / 2;

    const characterSprite =
      interactiveCharRef.current?.getSprite() as CharacterSprite;
    if (!characterSprite || !appRef.current) {
      console.warn("No character sprite or app ref");
      return;
    }

    const newInteractiveItem = new InteractiveSprite(
      itemContainer,
      newItemSprite,
      appRef.current,
      {
        resizable: false,
        droppable: true,
        onDropResetToInitial,
        isOnTopOfSprite,
        targetSpriteGetter: () =>
          interactiveCharRef.current?.getSprite() as CharacterSprite,
        onDropOnSprite: async (
          droppedSprite: AllSetupSprites,
          app: Application
        ) => {
          try {
            if (!interactiveCharRef.current || !characterContainerRef.current) {
              console.warn("No character sprite");
              return null;
            }

            if (!appRef.current) {
              console.warn("Pixi Application is not initialized");
              return null;
            }

            interactiveCharRef.current.setLoading(true);
            console.log("characterSprite", characterSprite);

            const newCharSprite = await onDropOnSpriteTryOn(
              interactiveCharRef.current.getSprite() as CharacterSprite,
              droppedSprite,
              triggerTryOn,
              app
            );
            interactiveCharRef.current.setLoading(false);

            // Ensure to set the new character sprite to the current instance of InteractiveSprite
            interactiveCharRef.current.setNewSprite(
              newCharSprite as CharacterSprite
            );

            return newCharSprite;
          } catch (error) {
            console.log("Error onDropOnSpriteTryOn");
            console.error(error);
          }

          return null;
        },
      }
    );

    itemsContainerRef.current.addChild(itemContainer); // Add the item container to the stage
    itemContainersRef.current.push(newInteractiveItem.getContainer()); // Add the item container to the item containers array
  }, [itemSprites, itemsContainerRef, itemContainersRef]);

  return null;
};

export default Items;
