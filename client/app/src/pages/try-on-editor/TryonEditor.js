import React, { useState } from 'react';
import { Texture, Sprite } from 'pixi.js';
import CharacterPlaceholder from '../../components/try-on-placeholders/CharacterPlaceholder';
import ItemsPlaceholder from '../../components/try-on-placeholders/ItemsPlaceholder';

const TryonEditor = () => {
    const [charSprite, setCharSprite] = useState(null);
    const [itemSprites, setItemSprites] = useState([]);
    const [showWardrobe, setShowWardrobe] = useState(false);
    
    const uploadCharacter = (event) => {
        const file = event.target.files[0];
        if (!file) return;
    
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const texture = Texture.from(img);
                const sprite = new Sprite(texture);
                sprite.anchor.set(0.5);
            
                setCharSprite(sprite);               
            };
        };
        reader.readAsDataURL(file);
    };

    const uploadItems = (event) => {
        const file = event.target.files[0];
        if (!file) return;
    
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const texture = Texture.from(img);
                const sprite = new Sprite(texture);
                sprite.anchor.set(0.5);
            
                setItemSprites([...itemSprites, sprite])               
            };
        };
        reader.readAsDataURL(file);
    };

    return (
        <div>
            <input type="file" onChange={uploadCharacter} />
            <input type="file" onChange={uploadItems} />
            <button onClick={() => setShowWardrobe(!showWardrobe)}>Toggle Items</button>
            <div className='flex justify-center items-center h-screen'>
                <div className='w-full'>
                    <div className='mb-4'>
                        <CharacterPlaceholder sprite={charSprite} />
                    </div>
                    <div>
                        {showWardrobe ?? <ItemsPlaceholder sprites={itemSprites} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TryonEditor;
