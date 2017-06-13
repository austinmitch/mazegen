//https://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_backtracker

/**
* PSEUDO CODE

 * Adding A* algorithm to mazegen
 * Walls are no longer entire block
 * need to analyze "next" space and check it walls

 * if(next == [i+1][j])
   * if(next.walls[1] == true)
    * Cant proceed

 * repeat above code for top bottom left and right walls
*/





var cols, rows;
var w = 40;
var grid;

var current;

var stack = [];


function setup() {
  createCanvas(400, 400);
  cols = floor(width/w);
  rows = floor(height/w);

  grid = new Array(cols);

  for(i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }
  for(var j = 0; j < rows; j++) {
    for(var i = 0; i < cols; i++) {
      grid[i][j] = new Cell(i,j);
    }
  }

  current = grid[0][0];
}

function draw() {
  background(51);
  for(var i = 0; i < cols; i++) {
    for(var j = 0; j < rows; j++) {
      grid[i][j].show();
    }
  }
  current.visited = true
  current.checkNeighbors(grid);
  var next = current.checkNeighbors(grid);
  if(next) {
    next.visited = true;

    stack.push(current);

    removeWalls(current, next);

    current = next;
  } else if(stack.length > 0) {
    current = stack.pop();
  }
  if(stack.length === 0) {
    noLoop();
    // saveCanvas('maze','jpg');
  }

}

function Cell(i, j) {
  this.i = i; // col
  this.j = j; // row
  this.walls = [true, true, true, true];
  this.visited = false;
  this.checkNeighbors = function(grid) {
    var i = this.i;
    var j = this.j;
    var neighbors = [];

    if(j > 0) { var top = grid[i][j-1]; }
    if(i < cols-1) { var right = grid[i+1][j]; }
    if(j < rows-1) { var bottom = grid[i][j+1]; }
    if(i > 0) { var left = grid[i-1][j]; }

    if(top && !top.visited) {
      neighbors.push(top);
    }
    if(right && !right.visited) {
      neighbors.push(right);
    }
    if(bottom && !bottom.visited) {
      neighbors.push(bottom);
    }
    if(left && !left.visited) {
      neighbors.push(left);
    }

    if(neighbors.length > 0) {
      var r = floor(random(0, neighbors.length));
      return neighbors[r];
    } else {
      return undefined;
    }
  }
  this.highlight = function() {
    var x = this.i*w;
    var y = this.j*w;
    noStroke();
    fill(255,255,0);
    rect(x,y,w,w);
  }
  this.show = function() {
    var x = this.i*w;
    var y = this.j*w;
    stroke(255);
    if(this.walls[0]) {
      line(x,y,x+w,y); // top
    }
    if(this.walls[1]) {
      line(x+w,y,x+w,y+w); // right
    }
    if(this.walls[2]) {
      line(x+w,y+w,x,y+w); // bottom
    }
    if(this.walls[3]) {
      line(x,y+w,x,y); // left
    }

    if(this.visited) {
      fill(255,0,255,100);
      noStroke();
      rect(x,y,w,w);
    }
  }
}

function removeWalls(a,b) {
  var x = a.i - b.i;
  if(x === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if( x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }
  var y = a.j - b.j;
  if(y === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if( y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}
