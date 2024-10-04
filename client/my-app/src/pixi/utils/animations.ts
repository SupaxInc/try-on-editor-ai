import { Sprite, Application, Container, Ticker } from "pixi.js";
import { NamedContainer } from "../types";

export const showLoadingCircleSpinner = (
  sprite: Sprite,
  app: Application,
  spriteContainer: NamedContainer
): Container => {
  const circleLoadingSpinnerContainer = new Container() as NamedContainer;
  circleLoadingSpinnerContainer.label = "circleLoadingSpinnerContainer";

  const size = 100;
  const ballAmount = 7;
  const balls: Sprite[] = [];

  // Create balls and add them to the container
  // Loop to create and position the balls for the loading spinner
  for (let i = 0; i < ballAmount; i++) {
    // Create a new sprite using a circle image
    const ball = Sprite.from("https://pixijs.com/assets/circle.png");

    // Set the anchor point to the center of the ball
    ball.anchor.set(0.5, 0.5);

    // Add the ball to the spinner container
    circleLoadingSpinnerContainer.addChild(ball);

    // Calculate and set the position of the ball in a circular arrangement
    ball.position.set(
      // X position: center + radius * cos(angle)
      size / 2 + (Math.cos((i / ballAmount) * Math.PI * 2) * size) / 3,
      // Y position: center + radius * sin(angle)
      size / 2 + (Math.sin((i / ballAmount) * Math.PI * 2) * size) / 3
    );

    // Add the ball to the balls array for later animation
    balls.push(ball);
  }

  // Using local bounds to ensure we are working with dimensions relative to the container
  const loadingSpinnerBounds = circleLoadingSpinnerContainer.getLocalBounds();

  // Pivot achieves a similar effect to anchor for a sprite but is used for objects like containers
  // In this case, it is used to center the point of the loading spinner container rather than its top left corner
  circleLoadingSpinnerContainer.pivot.set(
    loadingSpinnerBounds.width / 2,
    loadingSpinnerBounds.height / 2
  );

  // Position the spinner container at the center of the sprite
  circleLoadingSpinnerContainer.x = spriteContainer.width / 2;
  circleLoadingSpinnerContainer.y = spriteContainer.height / 2;
  spriteContainer.addChild(circleLoadingSpinnerContainer);

  // Phase represents the current state of the animation. Controls timing and progression of the animation.
  let phase = 0;
  // Spinner animation function that will be called on each frame
  const spinnerAnimation = (ticker: Ticker) => {
    // Increment the phase based on the time elapsed since the last frame
    phase += ticker.deltaMS / 1000;
    // Ensure the phase stays within the range of 0 to 2π
    phase %= Math.PI * 2;

    // Animate each ball in the spinner
    balls.forEach((b, i) => {
      // Calculate a sinusoidal value based on the ball's position and current phase
      const sin = Math.sin((i / ballAmount) * Math.PI - phase);
      // Set the scale of the ball using a modified sine wave
      // This creates a pulsing effect where balls grow and shrink
      b.scale.set(Math.abs(sin * sin * sin * 0.5) + 0.5);
    });
  };

  // Adding to ticker allows the function animation to be called on every frame update. Allows for animation to be dynamic.
  app.ticker.add(spinnerAnimation);

  return circleLoadingSpinnerContainer;
};
