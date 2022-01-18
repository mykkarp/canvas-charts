import { getChartData } from './data.js';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 200;
const PADDING = 40;
const DPI_CANVAS_WIDTH = CANVAS_WIDTH * 2;
const DPI_CANVAS_HEIGHT = CANVAS_HEIGHT * 2;
const CANVAS_VIEW_HEIGHT = DPI_CANVAS_HEIGHT - PADDING * 2;
const CANVAS_VIEW_WIDTH = DPI_CANVAS_WIDTH;
const ROWS_COUNT = 5;

function chart(canvas, data) {
  const ctx = canvas.getContext('2d');
  canvas.style.width = CANVAS_WIDTH + 'px';
  canvas.style.height = CANVAS_HEIGHT + 'px';
  canvas.width = DPI_CANVAS_WIDTH;
  canvas.height = DPI_CANVAS_HEIGHT;

  const [yMin, yMax] = computeBoundaries(data);
  const textStep = (yMax - yMin) / ROWS_COUNT;
  const yRatio = CANVAS_VIEW_HEIGHT / (yMax - yMin);
  const xRatio = CANVAS_VIEW_WIDTH / (data.columns[0].length - 2);

  // === y axis
  const step = CANVAS_VIEW_HEIGHT / ROWS_COUNT;

  ctx.beginPath();
  ctx.strokeStyle = '#bbb';
  ctx.font = 'normal 20px Helvestica,sans-serif';
  ctx.fillStyle = '#96a2aa';
  for (let i = 1; i <= ROWS_COUNT; i++) {
    const y = i * step + PADDING;
    const text = Math.round(yMax - textStep * i);
    ctx.fillText(text.toString(), 5, y - 10);
    ctx.moveTo(0, y);
    ctx.lineTo(DPI_CANVAS_WIDTH, y);
  }
  ctx.stroke();
  ctx.closePath();
  // ===

  data.columns.forEach(col => {
    const name = col[0];
    if (data.types[name] === 'line') {
      const coords = col.map((y, i) => [
        Math.floor((i - 1) * xRatio),
        Math.floor(DPI_CANVAS_HEIGHT - PADDING - y * yRatio)
      ])
      coords.shift();

      const color = data.colors[name];
      drawLines(ctx, coords, { color });
    }
  });
}

chart(document.querySelector('#chart'), getChartData());

function drawLines(ctx, coords, { color }) {
  ctx.beginPath();
  ctx.lineWidth = 4;
  ctx.strokeStyle = color;
  for (const [x, y] of coords) {
    ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.closePath();
}

function computeBoundaries({ columns, types }) {
  let min = null;
  let max = null;

  console.log(types);
  columns.forEach(column => {
    if (types[column[0]] !== 'line') {
      return;
    }

    if (typeof min !== 'number') min = column[1];
    if (typeof max !== 'number') max = column[1];

    if (min > column[1]) min = column[1];
    if (max < column[1]) max = column[1];

    for (let i = 2; i < column.length; i++) {
      if (min > column[i]) min = column[i];
      if (max < column[i]) max = column[i];
    }
  });


  return [min, max];
}