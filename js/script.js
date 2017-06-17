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

 * A* code cant start until hte maze is finished
 * it will need to go inside of a while loop like
 * it does in the pseudo code on the wikipedia page
*/




/**
 * Maze Gen Vars
*/
var cols, rows;
var w = 40;
var grid;
var current;
var stack = [];

/**
 * A* Vars
*/

var openSet = [];
var closedSet = [];
var start;
var end;
var path = [];




function setup() {
  createCanvas(400, 400);
  cols = floor(width/w);
  rows = floor(height/w);

  /**
   * Making the 2D array
  */
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
    astar(grid);
    // saveCanvas('maze','jpg');
  }
}

/**
 * Function to solve maze.
*/
function astar(astarGrid) {
  start = astarGrid[0][0];
  end = astarGrid[cols - 1][rows - 1];

  openSet.push(start);
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      astarGrid[i][j].addNeighbors(astarGrid);
    }
  }

  var winner = 0;
  while (openSet.length >= 0) {
    console.log('looped');
        for (var i = 0; i < openSet.length; i++) {
          if(openSet[i].f < openSet[winner].f) {
        winner = i;
      }
    }
    var astarCurrent = openSet[winner];
    console.log(astarCurrent);

    // var temp = astarCurrent;
    // path.push(temp)
    // while(temp.previous) {
    //   path.push(temp.previous);
    //   temp = temp.previous;
    // }

    for(var i = 0; i < path.length; i++) {
      path[i].show(color(255,0,0));
    }

    if(astarCurrent == end) {
      console.log('done');
      console.log(path);
      break;
    }
    console.log(astarCurrent);
    removeFromArray(openSet, astarCurrent);
    closedSet.push(astarCurrent);

    var astarNeighbors = astarCurrent.astarNeighbors;
    for (var k = 0; k < astarNeighbors.length; k++) {
      var neighbor = astarNeighbors[k];

      if(!closedSet.includes(neighbor)) {
        if(
            val(neighbor.j-1) && neighbor === astarGrid[neighbor.i][neighbor.j-1] && neighbor.wall[0] != true ||
            val(neighbor.i+1) && neighbor === astarGrid[neighbor.i+1][neighbor.j] && neighbor.wall[1] != true ||
            val(neighbor.j+1) && neighbor === astarGrid[neighbor.i][neighbor.j+1] && neighbor.wall[2] != true ||
            val(neighbor.i-1) && neighbor === astarGrid[neighbor.i-1][neighbor.j] && neighbor.wall[3] != true
          ) {
          console.log('can go that way');
          var tempG = astarCurrent.g + 1;

          var newPath = false;
          if(openSet.includes(neighbor)) {
            if(tempG < neighbor.g) {
              neighbor.g = tempG;
              newPath = true;
            }
          }else{
            neighbor.g = tempG;
            newPath = true;
            openSet.push(neighbor);
          }

          if(newPath) {
            neighbor.h = heuristic(neighbor,end);
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.previous = current;
          }
          // end of block
        }

      }
    }

  }
  if(openSet.length < 0){
    //no solution
    console.log('no solution');
    console.log(path);
    return;
  }

} //end of astar

function Cell(i, j) {

  /**
   * Maze gen vars
  */
  this.i = i; // col
  this.j = j; // row
  this.walls = [true, true, true, true];
  this.visited = false;

  /**
   * A* vars
  */
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.previous = undefined;
  this.astarNeighbors = []; // A* neighbors

  this.addNeighbors = function(grid) {
    var i = this.i;
    var j = this.j;

    if(i < cols-1) {
      this.astarNeighbors.push(grid[i+1][j]);
    }
    if(i > 0) {
      this.astarNeighbors.push(grid[i-1][j]);
    }
    if(j < rows - 1) {
      this.astarNeighbors.push(grid[i][j+1]);
    }
    if(j > 0) {
      this.astarNeighbors.push(grid[i][j-1]);
    }
  }

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

/**
 * A* functions
*/
function removeFromArray(arr, elt) {
  for(var i = arr.length-1; i >= 0; i--) {
    if(arr[i] == elt) {
      arr.splice(i,1);
    }
  }
}

function heuristic(a,b) {
  // Euchlidean distance
  var d = dist(a.i, a.j, b.i, b.j);

  // Taxicab distance
  // var d = abs(a.i - b.) + abs(a.j, b.j);

  return d;
}

/**
 * Validation function to make sure the Cell
 * being checked actually exists
*/
function val(i) {
  var val;
  if(i === -1 || i === cols+1 || i === rows+1) {
    val = false;
  }
  else {
    val = true;
  }
  return val;
}
