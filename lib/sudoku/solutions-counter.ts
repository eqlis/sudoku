import { GRID_LENGTH } from "./constants";
import { SudokuState } from "./sudoku-state";

export function countSolutions(grid: number[][], limit: number): number {
  const state = SudokuState.fromGrid(grid);

  return count(0, 0, limit);

  function count(row: number, col: number, limit: number): number {
    if (row == GRID_LENGTH) {
      return 1;
    }

    let nextRow = (col == GRID_LENGTH - 1) ? row + 1 : row;
    let nextCol = (col == GRID_LENGTH - 1) ? 0 : col + 1;

    if (grid[row][col] > 0) {
      return count(nextRow, nextCol, limit);
    }

    let counter = 0;

    for (let val = 1; val <= GRID_LENGTH; val++) {
      if (state.isValid(row, col, val)) {
        state.place(row, col, val);
        counter += count(nextRow, nextCol, limit);
        state.remove(row, col, val);
        if (counter >= limit) {
          return counter;
        }
      }
    }

    return counter;
  }
}