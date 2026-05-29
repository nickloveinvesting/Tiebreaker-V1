export type Board = (string | null)[][]; // 7 cols, 6 rows

export function createEmptyBoard(): Board {
  return Array(7).fill(null).map(() => Array(6).fill(null));
}

// Drops a piece in a column, returns the row it landed in, or -1 if full
export function dropPiece(board: Board, col: number, playerId: string): number {
  const column = board[col];
  for (let row = 5; row >= 0; row--) {
    if (column[row] === null) {
      column[row] = playerId;
      return row;
    }
  }
  return -1;
}

export function checkWin(board: Board, col: number, row: number, playerId: string): boolean {
  if (col < 0 || col >= 7 || row < 0 || row >= 6) return false;
  
  const directions = [
    [[0, 1], [0, -1]], // Vertical
    [[1, 0], [-1, 0]], // Horizontal
    [[1, 1], [-1, -1]], // Diagonal /
    [[1, -1], [-1, 1]]  // Diagonal \
  ];

  for (let dir of directions) {
    let count = 1;
    for (let currentDir of dir) {
      let r = row + currentDir[1];
      let c = col + currentDir[0];
      
      while (r >= 0 && r < 6 && c >= 0 && c < 7 && board[c][r] === playerId) {
        count++;
        r += currentDir[1];
        c += currentDir[0];
      }
    }
    if (count >= 4) return true;
  }
  
  return false;
}

export function isBoardFull(board: Board): boolean {
  return board.every(col => col[0] !== null);
}
