const grid = document.getElementById("grid");
const maskSvg = document.getElementById("mask-svg");
const maskRect = document.getElementById("mask-rect");
const maskCircle = document.getElementById("mask-circle");
maskCircle.style.r = 140;

let isFixed = false;
let gridSize = {};
let maskWidth = globalThis.innerWidth * 3;
let maskHeight = globalThis.innerHeight * 3;
fitGrid();
fitMask();

globalThis.addEventListener("resize", fitMask);
globalThis.addEventListener("resize", fitGrid);
globalThis.addEventListener("resize", scrollTop);

// Create Spotlight
const div = document.createElement("div");
div.style.position = "absolute";
div.style.width = `${maskWidth}px`;
div.style.height = `${maskHeight}px`;
div.style.mask = "url(#mask)";
div.style.background = "black";
div.style.opacity = "0.7";
div.style.zIndex = "1000";
document.body.appendChild(div);

document.addEventListener("click", async (event) => {
  isFixed = !isFixed;
  document.body.style.cursor = isFixed ? "crosshair" : "none";

  if (isFixed) {
    const circleRadius = maskCircle.style.r;
    const circleX = event.x;
    const circleY = event.y;
    const tracks = [];

    for (const trackCover of grid.getElementsByClassName("track-cover")) {
      const trackRect = trackCover.getBoundingClientRect();
      if (
        doCircleAndRectangleOverlap(
          circleX,
          circleY,
          circleRadius,
          trackRect.x,
          trackRect.y,
          trackRect.width,
          trackRect.height,
        )
      ) {
        tracks.push(trackCover.id);
      }
    }

    await fetch("/api/play", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tracks }),
    });
  }
});

function doCircleAndRectangleOverlap(cx, cy, r, rx, ry, width, height) {
  // Define the rectangle's edges
  const rx2 = rx + width;
  const ry2 = ry + height;

  // Find the closest point on the rectangle to the circle's center
  const closestX = Math.max(rx, Math.min(cx, rx2));
  const closestY = Math.max(ry, Math.min(cy, ry2));

  // Calculate the distance from the closest point to the circle's center
  const distanceX = Math.abs(cx - closestX);
  const distanceY = Math.abs(cy - closestY);

  // Check if the circle is close enough to the rectangle
  if (distanceX > (r + width) || distanceY > (r + height)) return false; // No possible overlap

  // If the circle's center is inside the rectangle
  if (cx >= rx && cx <= rx2 && cy >= ry && cy <= ry2) return true;

  // Check corner distances for overlap
  const cornerDistanceSq = distanceX ** 2 + distanceY ** 2;

  return cornerDistanceSq <= r ** 2;
}

({
  /*
  const rect = grid.getBoundingClientRect();

  const x = Math.floor((event.x - rect.left) / (rect.width / gridSize.width));
  const y = Math.floor((event.y - rect.top) / (rect.height / gridSize.height));

  console.log(x, y, x + y * gridSize.height);

  await fetch("/api/play", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({track: x + y * gridSize.width}),
  });
  */
});

document.addEventListener("wheel", (event) => {
  if (!isFixed) {
    const modifier = (event.wheelDelta < 0 ? -1 : 1) *
      (Number(maskCircle.style.r) < 620
        ? Number(maskCircle.style.r) < 220 ? 30 : 60
        : 120);
    maskCircle.style.r = (Number(maskCircle.style.r) + modifier) == 0
      ? 20
      : (Number(maskCircle.style.r) + modifier);
    console.log(maskCircle.style.r);
  }
});

document.addEventListener("mousemove", (event) => {
  if (!isFixed) {
    div.style.left = `${event.x - maskWidth / 2}px`;
    div.style.top = `${event.y - maskHeight / 2}px`;
  }
});

function fitMask() {
  maskWidth = globalThis.innerWidth * 3;
  maskHeight = globalThis.innerHeight * 3;

  maskSvg.style.width = globalThis.innerWidth * 3;
  maskSvg.style.height = globalThis.innerHeight * 3;

  maskRect.style.width = globalThis.innerWidth * 3;
  maskRect.style.height = globalThis.innerHeight * 3;

  maskCircle.style.cx = globalThis.innerWidth * 3 / 2;
  maskCircle.style.cy = globalThis.innerHeight * 3 / 2;
}

function fitGrid() {
  const n = grid.childElementCount;
  const sqrtN = Math.floor(Math.sqrt(n));
  let a = sqrtN;
  let b = sqrtN;

  // Find the largest factor pair that multiplies to n
  while (a > 0) {
    if (n % a === 0) {
      b = n / a;
      break;
    }
    a--;
  }

  if (globalThis.innerWidth < globalThis.innerHeight) {
    gridSize = { width: Math.min(a, b), height: Math.max(a, b) };
  } else {
    gridSize = { width: Math.max(a, b), height: Math.min(a, b) };
  }
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = `repeat(${gridSize.width}, 1fr)`;
}

function scrollTop() {
  globalThis.scrollTo(0, 0);
}
