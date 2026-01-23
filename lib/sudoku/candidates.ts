import { GRID_LENGTH } from "./constants";
import { SudokuState } from "./sudoku-state";

export function computeCandidates(grid: number[][]): Set<number>[][] {
  const state = SudokuState.fromGrid(grid);

  const candidates: Set<number>[][] = Array.from({ length: GRID_LENGTH }, () =>
    Array.from({ length: GRID_LENGTH }, () => new Set<number>())
  );

  for (let r = 0; r < GRID_LENGTH; r++) {
    for (let c = 0; c < GRID_LENGTH; c++) {
      if (grid[r][c] === 0) {
        for (let v = 1; v <= GRID_LENGTH; v++) {
          if (state.isValid(r, c, v)) {
            candidates[r][c].add(v);
          }
        }
      }
    }
  }

  return candidates;
}
