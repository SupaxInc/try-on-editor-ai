import axios from 'axios';

export const triggerTryOn = async (charSprite, itemSprite) => {
    try {
        const charBlob = await getBase64FromSprite(charSprite);
        const itemBlob = await getBase64FromSprite(itemSprite);

        const formData = new FormData();
        formData.append('avatar', charBlob, 'avatar.png');
        formData.append('clothing', itemBlob, 'clothing.png');

        const response = await axios.post('/try-on', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        console.log(response.data);

        // const { jobId } = response.data;
        // pollForResult(jobId);
    } catch (error) {
        console.error('Error triggering try-on:', error);
    }
};

// Convert a Pixi.js sprite's texture into a PNG blob
const getBase64FromSprite = (sprite) => {
    return new Promise((resolve) => {
        // Get the texture from the sprite
        const texture = sprite.texture;
        
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions to match the texture
        canvas.width = texture.width;
        canvas.height = texture.height;
        
        // Draw the texture onto the canvas
        ctx.drawImage(texture.baseTexture.resource.source, 0, 0);
        
        // Convert the canvas content to a PNG blob and resolve the promise with it
        canvas.toBlob((blob) => resolve(blob), 'image/png');
    });
};
