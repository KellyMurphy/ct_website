let grid;
let score = 0;

function isGameOver() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] == 0) {
        return false;
      }
      if (i !== 3 && grid[i][j] === grid[i + 1][j]) {
        return false;
      }
      if (j !== 3 && grid[i][j] === grid[i][j + 1]) {
        return false;
      }
    }
  }
  return true;
}

function got2048() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] == 2048) {
        return true;
      }
    }
  }
  return false;
}

function blankGrid() {
  return [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
}

function setup() {
  createCanvas(400, 400);
  noLoop();
  grid = blankGrid();
  // console.table(grid);
  addNumber();
  addNumber();
  updateCanvas();
}

function addNumber() {
  let options = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) {
        options.push({
          x: i,
          y: j
        });
      }
    }
  }
  if (options.length > 0) {
    let spot = random(options);
    let r = random(1);
    grid[spot.x][spot.y] = r > 0.5 ? 2 : 4;
  }
}

function compare(a, b) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (a[i][j] !== b[i][j]) {
        return true;
      }
    }
  }
  return false;
}

function copyGrid(grid) {
  let extra = blankGrid();
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      extra[i][j] = grid[i][j];
    }
  }
  return extra;
}

function flipGrid(grid) {
  for (let i = 0; i < 4; i++) {
    grid[i].reverse();
  }
  return grid;
}

function transposeGrid(grid) {
  let newGrid = blankGrid();
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      newGrid[i][j] = grid[j][i];
    }
  }
  return newGrid;
}

function keyPressed() {
  let past = copyGrid(grid);

  switch (keyCode) {
    case DOWN_ARROW:
      {
        makeMove();
        break;
      }
    case UP_ARROW:
      {
        grid = flipGrid(grid);
        makeMove();
        grid = flipGrid(grid);
        break;
      }
    case RIGHT_ARROW:
      {
        grid = transposeGrid(grid);
        makeMove();
        grid = transposeGrid(grid);
        break;
      }
    case LEFT_ARROW:
      {
        grid = transposeGrid(grid);
        grid = flipGrid(grid);
        makeMove();
        grid = flipGrid(grid);
        grid = transposeGrid(grid);
        break;
      }
  }
  let changed = compare(past, grid);
  if (isGameOver()) {
    updateCanvas();
    alert("GAME OVER");
  } else

  if (changed) {
    addNumber();
    updateCanvas();
  }

  if (got2048()) {
    alert("You have reached 2048!!!");
  }
}

function makeMove() {
  for (let i = 0; i < 4; i++) {
    grid[i] = operate(grid[i]);
  }
}

function operate(row) {
  row = slide(row);
  row = combine(row);
  row = slide(row);
  return row;
}

function updateCanvas() {
  background(255);
  drawGrid();
  select('#score').html(score);
}

function slide(row) {
  let arr = row.filter(val => val);
  let missing = 4 - arr.length;
  let zeros = Array(missing).fill(0);
  arr = zeros.concat(arr);
  return arr;
}

function combine(row) {
  for (let i = 3; i >= 1; i--) {
    let a = row[i];
    let b = row[i - 1];
    if (a == b) {
      row[i] = a + b;
      score += row[i];
      row[i - 1] = 0;
    }
  }
  return row;
}

function drawGrid() {
  let w = 100;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      noFill();
      strokeWeight(2);
      stroke(0);
      rect(i * w, j * w, w, w);
      let val = grid[i][j];
      if (grid[i][j] !== 0) {
        textAlign(CENTER, CENTER);
        let s = "" + val;
        let len = s.length - 1;
        let sizes = [64, 64, 52, 42];
        fill(0);
        noStroke();
        textSize(sizes[len]);
        text(val, i * w + w / 2, j * w + w / 2);
      }
    }
  }
}
