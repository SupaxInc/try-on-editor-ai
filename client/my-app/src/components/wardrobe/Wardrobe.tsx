import React, { useEffect } from "react";
import { Container, Graphics, Sprite } from "pixi.js";
import { usePixi } from "../../pixi/contexts/PixiContext.tsx";
import { NamedContainer } from "../../pixi/types.ts";
import Items from "../items/Items.tsx";

const Wardrobe: React.FC<{ itemSprites: Sprite[] }> = ({ itemSprites }) => {
  const { wardrobeContainerRef, appRef, itemsContainerRef } = usePixi();

  /* Setting up the Fitting Room and Items Containers */
  useEffect(() => {
    // Containers scales its resolution based on its children, so use graphics to create boundaries for wardrobe
    const setWardrobeBounds = (wardrobeContainer: NamedContainer) => {
      if (!appRef.current) return;

      const boundary = new Graphics();
      const wardrobeWidth = appRef.current.screen.width; // Full width of app canvas
      const wardrobeHeight = appRef.current.screen.height * 0.25; // Remaining 25% of the height at the bottom

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

    // Containers scales its resolution based on its children, so use graphics to create boundaries for items
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

    /* Setup Wardrobe container */
    if (!wardrobeContainerRef.current) {
      const wardrobeContainer = setupWardrobeContainer();
      appRef.current.stage.addChild(wardrobeContainer);
      wardrobeContainerRef.current = wardrobeContainer;
      // (0,0) origin is top left of canvas, imagine the wardrobe rectangle where origin is top left (0,0)
      wardrobeContainerRef.current.x = 0; // Position x to start at left of canvas
      // Position y to start at wardrobe height - the app canvas's screen height, so it starts 80% of screen
      wardrobeContainerRef.current.y =
        appRef.current.screen.height - wardrobeContainerRef.current.height;
    }

    /* Setup Items Container */
    if (!itemsContainerRef.current) {
      const itemsContainer = setupItemsContainer();
      wardrobeContainerRef.current.addChild(itemsContainer);
      itemsContainerRef.current = itemsContainer;

      // Position at top left of wardrobe container
      itemsContainerRef.current.x = 0;
      itemsContainerRef.current.y = 0;
    }

    return () => {
      // No need to destroy items container or item sprites as its children of wardrobe container
      if (wardrobeContainerRef.current) {
        wardrobeContainerRef.current.destroy({ children: true });
        wardrobeContainerRef.current = null;
        itemsContainerRef.current = null;
      }
    };
  }, [appRef, wardrobeContainerRef, itemsContainerRef]);

  return <Items itemSprites={itemSprites} />;
};

export default Wardrobe;
