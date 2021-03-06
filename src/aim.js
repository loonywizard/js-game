/**
 * Creates Aim
 *
 * Aim center coordinates are mouse coordinates
 *
 * @param {Texture} args.texture
 * @param {Object} args.size
 * @param {MouseController} args.mouseController
 * @param {Canvas} args.canvas
 * */
export default function createAim(args) {
  const {
    texture,
    size,
    mouseController,
    canvas,
  } = args;

  const position = { x: 0, y: 0 };
  const { ctx } = canvas;

  const update = () => {
    const mouseCoordinates = mouseController.getMouseCoordinates();

    const canvasOffset = canvas.getOffset();
    const canvasGameSize = canvas.getGameSize();
    const canvasRealSize = canvas.getRealSize();

    const coefficientX = canvasGameSize.x / canvasRealSize.x;
    const coefficientY = canvasGameSize.y / canvasRealSize.y;

    position.x = mouseCoordinates.x * coefficientX - (canvasOffset.x * coefficientX);
    position.y = mouseCoordinates.y * coefficientY - (canvasOffset.y * coefficientY);
  };

  const draw = () => {
    ctx.drawImage(texture, position.x - size.x / 2, position.y - size.y / 2, size.x, size.y);
  };

  return {
    update,
    draw,
  };
}
