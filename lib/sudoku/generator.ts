import { GRID_LENGTH } from "./constants";
import { countSolutions } from "./solutions-counter";
import { SudokuState } from "./sudoku-state";
import { Difficulty } from "./types";

export function generateGrid(difficulty: Difficulty): number[][] {
  const MAX_CLUES = difficulty === "Easy" ? 36 : difficulty === "Medium" ? 30 : 24;
  const state = SudokuState.empty();

  fill(0, 0);
  removeCells(shuffleCells());
  return state.grid;

  function shuffleCells(): number[][] {
    const shuffled: number[][] = Array.from({ length: GRID_LENGTH * GRID_LENGTH }, () => Array(2));
    let ind = 0;
    for (let i = 0; i < GRID_LENGTH; i++) {
      for (let j = 0; j < GRID_LENGTH; j++) {
        shuffled[ind][0] = i;
        shuffled[ind++][1] = j;
      }
    }
    shuffleRandomly(shuffled);
    return shuffled;
  }

  function shuffleRandomly<T>(arr: T[]): void {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const prev = arr[i];
      arr[i] = arr[j];
      arr[j] = prev;
    }
  }

  function fill(row: number, col: number): boolean {
    const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    shuffleRandomly(digits);
    for (let i = 0; i < GRID_LENGTH; i++) {
      if (state.isValid(row, col, digits[i])) {
        state.place(row, col, digits[i]);
        if (row == GRID_LENGTH - 1 && col == GRID_LENGTH - 1) {
          return true;
        } else if (col == GRID_LENGTH - 1) {
          if (fill(row + 1, 0)) {
            return true;
          }
        } else {
          if (fill(row, col + 1)) {
            return true;
          }
        }
        state.remove(row, col, digits[i]);
      }
    }
    return false;
  }

  function removeCells(shuffled: number[][]): void {
    let clues = shuffled.length;
    for (let i = 0; i < shuffled.length; i++) {
      let row = shuffled[i][0];
      let col = shuffled[i][1];
      let val = state.grid[row][col];
      state.remove(row, col, val);
      clues--;
      let solutions = countSolutions(state.grid, 2);
      if (solutions == 0) {
        state.place(row, col, val);
        break;
      }
      if (solutions > 1) {
        state.place(row, col, val);
        clues++;
      }
      if (clues <= MAX_CLUES) {
        break;
      }
    }
  }
}