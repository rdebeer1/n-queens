/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/


// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

window.loops = function(board, firstRow, rows, cb) {
  if (firstRow === rows) {
    return cb(board); 
  }
  for (var i = 0; i < rows; i++) {
    board.togglePiece(firstRow, i);
    if (!board.hasAnyRooksConflicts()) {
      var result = loops(board, firstRow + 1, rows, cb);
      if (result) { 
        return result; 
      }
    }
    board.togglePiece(firstRow, i);
  }
};

window.findNRooksSolution = function(n) {
  var solution; 
  var board = new Board({n: n});
  
  loops(board, 0, n, function(board) {
    return solution = board.rows();
  });
  
  console.log('Single solution for ' + n + ' rooks: ', JSON.stringify(solution));
  return solution;
};


window.countNRooksSolutions = function(n) {
  var solutionCount = 0; 
  var board = new Board({n: n});


  loops(board, 0, n, function(board) {
    solutionCount++;
  });
  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};
  

window.queenLoops = function(board, firstRow, rows, cb) {
  if (firstRow === rows) {
    return cb(board); 
  }
  for (var i = 0; i < rows; i++) {
    board.togglePiece(firstRow, i);
    if (!board.hasAnyQueensConflicts()) {
      var result = queenLoops(board, firstRow + 1, rows, cb);
      if (result) { 
        return result; 
      }
    }
    board.togglePiece(firstRow, i);
  }
};


// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var board = new Board({n: n});
  var solution = board.rows();
  
  queenLoops(board, 0, n, function(board) {
    return solution;
  });

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};


// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {

//   var solutionCount = 0; 
//   var board = new Board({n: n});
  // var solutionCount = 0;
  // var board = new Board({n: n});


//   queenLoops(board, 0, n, function(board) {
//      solutionCount++;
//   });
//   console.log('Number of solutions for ' + n + ' queens:', solutionCount);
//   return solutionCount;
// };
  //Keeps track of the number of valid solutions
  var count = 0;
  //Helps identify valid solutions up to 32-bits because technically all integers are stored with that many bits
  var valid = Math.pow(2, n) - 1;
  //valid creates a bit sequence w/ 1 for every entery up to the nth 
  //valid and siege automatically sets all other bits to zero so I do not have to worry about them.

  //Checks all the possible board configurations
  var innerLoop = function(majorDiagonal, columns, minorDiagonal) {
    //These are technically integers, but the algorithm takes advantage of the fact that an integer is represented by a sequence of bits.
    //if our n = 5, we can think of majorDiagonal, columns, and minorDiagonals
    //as all being equal to 00000. Because This is our starting place,  
    //none of these places are taken yet(thus 00000).
    //If all columns are occupied, we have our finished solution.
    if (columns === valid) {
      count++;
      return;
    }

    //If any columns are occupied we flip that column to 0
    //Gets a bit sequence with 1's where there is an open location
    var siege = ~ (majorDiagonal | minorDiagonal | columns);
    //the siege variable just represents the diagonals and columns that 
    //do not have conflicts
    //This loops as long as there is a valid place to put another queen
    while (siege & valid) {
      var bit = siege & - siege;
      //the first line, var bit = siege & - siege stores the first non-zero bit 
      //(at the first open location) and stores it in var bit;
      siege -= bit;
      //marks the position in the current row as being occupied by flipping that column in siege to 0.
      //So when the loop continues, we know not to try that location again
      innerLoop((majorDiagonal | bit) >> 1, columns | bit, (minorDiagonal | bit) << 1);
      //combines the minort and bit with an OR operation. In bit logical operations always returns 0 or 1.
      //The operators >> 1 and 1 << simply move all the bits in a bit sequence one digit to the right or left
      //If we start at the top row and move down, every time access a new row, 
      //we need to keep our occupied diagonal tracking variables, majorDiagonal and minorDiagonal current
    }
  };

  innerLoop(0, 0, 0);

  return count;
};
