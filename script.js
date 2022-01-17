const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 200;
const PADDING = 40;
const DPI_CANVAS_WIDTH = CANVAS_WIDTH * 2;
const DPI_CANVAS_HEIGHT = CANVAS_HEIGHT * 2;
const CANVAS_VIEW_HEIGHT = DPI_CANVAS_HEIGHT - PADDING * 2;
const ROWS_COUNT = 5;

function chart(canvas, data) {
  const ctx = canvas.getContext('2d');
  canvas.style.width = CANVAS_WIDTH + 'px';
  canvas.style.height = CANVAS_HEIGHT + 'px';
  canvas.width = DPI_CANVAS_WIDTH;
  canvas.height = DPI_CANVAS_HEIGHT;

  const [yMin, yMax] = computeBoundaries(data);
  const textStep = (yMax - yMin) / ROWS_COUNT;
  const yRation = CANVAS_VIEW_HEIGHT / (yMax - yMin);

  // === y axis
  const step = CANVAS_VIEW_HEIGHT / ROWS_COUNT;

  ctx.beginPath();
  ctx.strokeStyle = '#bbb';
  ctx.font = 'normal 20px Helvestica,sans-serif';
  ctx.fillStyle = '#96a2aa';
  for (let i = 1; i <= ROWS_COUNT; i++) {
    const y = i * step + PADDING;
    const text = yMax - textStep * i;
    ctx.fillText(text.toString(), 5, y - 10);
    ctx.moveTo(0, y);
    ctx.lineTo(DPI_CANVAS_WIDTH, y);
  }
  ctx.stroke();
  ctx.closePath();
  // ===

  ctx.beginPath();
  for (const [x, y] of data) {
    ctx.lineTo(x, DPI_CANVAS_HEIGHT - PADDING - y * yRation);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ff0000';
    ctx.stroke();
  }
  ctx.closePath();
}

chart(document.querySelector('#chart'), [
  [0, 0],
  [50, 120],
  [120, 200],
  [200, 300],
  [300, 220]
]);

function computeBoundaries(data) {
  let min = null;
  let max = null;

  for (const [, y] of data) {
    if (typeof min !== 'number') min = y;
    if (typeof max !== 'number') max = y;
    if (min > y) min = y;
    if (max < y) max = y;
  }

  return [min, max];
}