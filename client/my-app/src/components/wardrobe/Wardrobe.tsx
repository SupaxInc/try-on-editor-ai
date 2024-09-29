import React, { useEffect, useRef } from "react";
import { Application, Container, Graphics, Sprite } from "pixi.js";
import { usePixi } from "../../pixi/contexts/PixiContext";
import {
  isOnTopOfSprite,
  onDropResetToInitial,
  onDropOnSpriteTryOn,
} from "../../pixi/utils/interactions.ts";
import { scaleSpriteToFitContainer } from "../../pixi/utils/helper";
import { triggerTryOn } from "../../api";
import InteractiveSprite from "../../pixi/classes/InteractiveSprite/InteractiveSprite";
import {
  NamedContainer,
  ItemSprite,
  CharacterSprite,
  AllSetupSprites,
} from "../../pixi/types";

const Wardrobe: React.FC<{ itemSprites: Sprite[] }> = ({ itemSprites }) => {
  const { wardrobeContainerRef, appRef, itemsContainerRef, charContainerRef } =
    usePixi();

  const totalItemsWidthRef = useRef<number>(0);

  /* Setting up the Wardrobe and Items Containers */
  useEffect(() => {
    const setWardrobeBounds = (wardrobeContainer: NamedContainer) => {
      if (!appRef.current) return;

      const boundary = new Graphics();
      const wardrobeWidth = appRef.current.screen.width;
      const wardrobeHeight = appRef.current.screen.height * 0.25;

      boundary.rect(0, 0, wardrobeWidth, wardrobeHeight);
      boundary.fill({ color: 0x333333 });

      wardrobeContainer.addChild(boundary);
    };

    const setupWardrobeContainer = (): NamedContainer => {
      const wardrobeContainer = new Container() as NamedContainer;
      wardrobeContainer.label = "wardrobeContainer";
      setWardrobeBounds(wardrobeContainer);
      return wardrobeContainer;
    };

    const setItemsBounds = (itemsContainer: NamedContainer) => {
      if (!wardrobeContainerRef.current) return;

      const boundary = new Graphics();
      const itemsWidth = wardrobeContainerRef.current.width;
      const itemsHeight = wardrobeContainerRef.current.height * 0.8;

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

    if (!wardrobeContainerRef.current) {
      const wardrobeContainer = setupWardrobeContainer();
      appRef.current.stage.addChild(wardrobeContainer);
      wardrobeContainerRef.current = wardrobeContainer;

      wardrobeContainerRef.current.x = 0;
      wardrobeContainerRef.current.y =
        appRef.current.screen.height - wardrobeContainerRef.current.height;
    }

    if (!itemsContainerRef.current && wardrobeContainerRef.current) {
      const itemsContainer = setupItemsContainer();
      wardrobeContainerRef.current.addChild(itemsContainer);
      itemsContainerRef.current = itemsContainer;

      itemsContainerRef.current.x = 0;
      itemsContainerRef.current.y = 0;
    }

    return () => {
      if (wardrobeContainerRef.current) {
        wardrobeContainerRef.current.destroy({ children: true });
        wardrobeContainerRef.current = null;
        itemsContainerRef.current = null;
      }
    };
  }, [appRef, wardrobeContainerRef, itemsContainerRef]);

  /* Setting up Items and Adding Items to the Wardrobe */
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

    scaleSpriteToFitContainer(newItemSprite, itemsContainerRef, 15);

    const itemSpacing = 200;
    const newPositionX =
      itemSprites.length > 1 ? totalItemsWidthRef.current + itemSpacing : 150;
    newItemSprite.x = newPositionX;
    newItemSprite.y = itemsContainerRef.current.height / 2;

    newItemSprite.initialX = newPositionX;
    newItemSprite.initialY = itemsContainerRef.current.height / 2;

    const newInteractiveItem = new InteractiveSprite(
      newItemSprite,
      appRef.current,
      {
        resizable: false,
        droppable: true,
        onDropResetToInitial,
        isOnTopOfSprite,
        targetSprite: characterSprite,
        onDropOnSprite: (droppedSprite: AllSetupSprites, app: Application) =>
          onDropOnSpriteTryOn(
            characterSprite,
            droppedSprite,
            triggerTryOn,
            app
          ),
      }
    );

    itemsContainerRef.current.addChild(newInteractiveItem.getSprite());

    totalItemsWidthRef.current += newPositionX;
  }, [itemSprites, itemsContainerRef, charContainerRef, appRef]);

  return null; // No DOM output
};

export default Wardrobe;
