import React, { useState } from 'react';

import CharacterPlaceholder from '../../components/try-on-placeholders/CharacterPlaceholder';
import { createSpriteFromFile } from './helper';
import PixiApp from '../../pixi/PixiApp';
import Wardrobe from '../../components/wardrobe/Wardrobe';

const TryonEditor = () => {
    const [charSprite, setCharSprite] = useState(null);
    const [itemSprites, setItemSprites] = useState([]);
    const [showWardrobe, setShowWardrobe] = useState(false);
    
    const uploadCharacter = (event) => {
        const file = event.target.files[0];
        if (!file) return;
    
        createSpriteFromFile(file, setCharSprite)
    };

    const uploadItems = (event) => {
        const file = event.target.files[0];
        if (!file) return;
    
        createSpriteFromFile(file, sprite => {
            setItemSprites(prevItemSprites => [...prevItemSprites, sprite]);
        });
    };

    return (
        <div className='flex flex-col items-center h-screen'>
            <div className='flex w-full justify-center p-4 bg-gray-100'>
                <input type="file" onChange={uploadCharacter} className="mr-4" />
                <button onClick={() => setShowWardrobe(!showWardrobe)} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Toggle Items</button>
            </div>
            
            <div className='flex flex-col justify-between items-center flex-grow'>
                <div className='w-full flex justify-center p-4'>
                    <PixiApp>
                        <CharacterPlaceholder charSprite={charSprite} />
                        {showWardrobe && <Wardrobe itemSprites={itemSprites} />}
                    </PixiApp>
                </div>
                {showWardrobe && (
                    <div className='w-full flex flex-col items-center mb-4'>
                        <input type="file" onChange={uploadItems} className="mb-4" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default TryonEditor;
