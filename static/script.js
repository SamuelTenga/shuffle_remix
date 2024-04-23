const grid = document.getElementById("grid");
const gridSize = findBestGrid(grid.childElementCount);

console.log(gridSize);

grid.addEventListener("click", async (event) => {
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
});

grid.style.gridTemplateColumns = `repeat(${gridSize.width}, 1fr)`;

function findBestGrid(n) {
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

  console.log(a, b);
  return { width: Math.max(a, b), height: Math.min(a, b) };
}
