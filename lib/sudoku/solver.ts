import { GRID_LENGTH } from "./constants";
import { SudokuState } from "./sudoku-state";

export function solve(grid: number[][]): number[][] {
  const state = SudokuState.fromGrid(grid);

  fill(0, 0);
  return state.grid;

  function fill(row: number, col: number): boolean {
    if (row == GRID_LENGTH) {
      return true;
    }

    const nextRow = (col == GRID_LENGTH - 1) ? row + 1 : row;
    const nextCol = (col == GRID_LENGTH - 1) ? 0 : col + 1;

    if (state.grid[row][col] > 0) {
      return fill(nextRow, nextCol);
    }

    for (let val = 1; val <= GRID_LENGTH; val++) {
      if (state.isValid(row, col, val)) {
        state.place(row, col, val);
        if (fill(nextRow, nextCol)) {
          return true;
        }
        state.remove(row, col, val);
      }
    }
    return false;
  }
}
