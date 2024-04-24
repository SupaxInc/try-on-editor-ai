import React, { useState } from 'react';
import { Texture, Sprite } from 'pixi.js';
import CharacterPlaceholder from '../../components/try-on-placeholders/CharacterPlaceholder';

const TryonEditor = () => {
    const [charSprite, setCharSprite] = useState(null);

    const uploadImage = (event) => {
        const file = event.target.files[0];
        if (!file) return;
    
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const texture = Texture.from(img);
                const sprite = new Sprite(texture);

                setCharSprite(sprite);            
            };
        };
        reader.readAsDataURL(file);
    };

    return (
        <div>
            <input type="file" onChange={uploadImage} style={{ position: 'absolute' }} />
            <CharacterPlaceholder sprite={charSprite} />
        </div>
    );
};

export default TryonEditor;
