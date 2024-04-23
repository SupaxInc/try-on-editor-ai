import React, { useRef, useEffect } from 'react';
import { Application, Texture, Sprite } from 'pixi.js';

const TryonEditor = () => {
    const pixiContainer = useRef(null);
    const appRef = useRef(null);

    const uploadImage = (event, container) => {
        const file = event.target.files[0];
        if (!file) return;
    
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const texture = Texture.from(img);
                const sprite = new Sprite(texture);
    
                // Optionally, resize the sprite to fit the container or adjust as needed
                sprite.x = (container.offsetWidth - sprite.width) / 2;
                sprite.y = (container.offsetHeight - sprite.height) / 2;

                appRef.current.stage.addChild(sprite);
            };
        };
        reader.readAsDataURL(file);
    };

    useEffect(() => {
        async function renderPixiContainer() {
            const app = new Application();
            
            await app.init({
                width: 800,
                height: 600,
                backgroundColor: 0x1099bb, 
                autoDensity: true, 
            });
            
            pixiContainer.current.appendChild(app.canvas);
            appRef.current = app;
        } 
        
        renderPixiContainer();
    }, [appRef]);

    return (
        <div ref={pixiContainer} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <input type="file" onChange={(event) => uploadImage(event, pixiContainer.current)} style={{ position: 'absolute' }} />
        </div>
    );
};

export default TryonEditor;
