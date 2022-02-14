import { getChartData } from './data.js';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 200;
const PADDING = 40;
const DPI_CANVAS_WIDTH = CANVAS_WIDTH * 2;
const DPI_CANVAS_HEIGHT = CANVAS_HEIGHT * 2;
const CANVAS_VIEW_HEIGHT = DPI_CANVAS_HEIGHT - PADDING * 2;
const CANVAS_VIEW_WIDTH = DPI_CANVAS_WIDTH;
const ROWS_COUNT = 5;
const DATE_COLUMNS_COUNT = 6;

function chart(canvas, data) {
  console.log(data);
  const ctx = canvas.getContext('2d');
  canvas.style.width = CANVAS_WIDTH + 'px';
  canvas.style.height = CANVAS_HEIGHT + 'px';
  canvas.width = DPI_CANVAS_WIDTH;
  canvas.height = DPI_CANVAS_HEIGHT;

  function mousemoveHandler({ offsetX, offsetY }) {
    console.log(clientX, offsetX, layerX);
  }
  canvas.addEventListener('mousemove', mousemoveHandler);

  const [yMin, yMax] = computeBoundaries(data);
  const yRatio = CANVAS_VIEW_HEIGHT / (yMax - yMin);
  const xRatio = CANVAS_VIEW_WIDTH / (data.columns[0].length - 2);
  const yData = data.columns.filter(col => data.types[col[0]] === 'line');
  const xData = data.columns.filter(col => data.types[col[0]] !== 'line')[0];

  // === Painting
  drawYAxis(ctx, yMin, yMax);
  drawXAxis(ctx, xData, xRatio);

  yData.map(toCoords(xRatio, yRatio)).forEach((coords, i) => {
    const color = data.colors[yData[i][0]];
    drawLines(ctx, coords, { color });
  })
  // ===
  return {
    destroy() {
      canvas.removeEventListener('mousemove', mousemoveHandler);
    }
  }
}

chart(document.querySelector('#chart'), getChartData());

function toCoords(xRatio, yRatio) {
  return (col) => col.map((y, i) => [
    Math.floor((i - 1) * xRatio),
    Math.floor(DPI_CANVAS_HEIGHT - PADDING - y * yRatio)
  ]).filter((_, i) => i !== 0);
}

function drawXAxis(ctx, xData, xRatio) {
  ctx.beginPath();
  const step = Math.round(xData.length / DATE_COLUMNS_COUNT);
  for (let i = 1; i < xData.length; i += step) {
    const text = toDate(xData[i]);
    ctx.fillText(text, i * xRatio, DPI_CANVAS_HEIGHT - 10)
  }
  ctx.closePath();
}

function drawYAxis(ctx, yMin, yMax) {
  const step = CANVAS_VIEW_HEIGHT / ROWS_COUNT;
  const textStep = (yMax - yMin) / ROWS_COUNT;

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
}

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

  columns.forEach(col => {
    if (types[col[0]] !== 'line') {
      return;
    }

    if (typeof min !== 'number') min = col[1];
    if (typeof max !== 'number') max = col[1];

    if (min > col[1]) min = col[1];
    if (max < col[1]) max = col[1];

    for (let i = 2; i < col.length; i++) {
      if (min > col[i]) min = col[i];
      if (max < col[i]) max = col[i];
    }
  });

  return [min, max];
}

function toDate(timestamp) {
  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Now', 'Dec'];
  const date = new Date(timestamp);
  return `${shortMonths[date.getMonth()]}, ${date.getDate()}`;
}