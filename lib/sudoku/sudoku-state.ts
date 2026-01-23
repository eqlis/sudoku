import { GRID_LENGTH, SQUARE_LENGTH } from "./constants";

export class SudokuState {
  grid: number[][];
  rows: boolean[][];
  cols: boolean[][];
  boxes: boolean[][];

  private constructor(grid: number[][]) {
    this.grid = grid;
    this.rows = Array.from({ length: GRID_LENGTH }, () => Array(GRID_LENGTH + 1).fill(false));
    this.cols = Array.from({ length: GRID_LENGTH }, () => Array(GRID_LENGTH + 1).fill(false));
    this.boxes = Array.from({ length: GRID_LENGTH }, () => Array(GRID_LENGTH + 1).fill(false));
    this.init();
  }

  static fromGrid(grid: number[][]) {
    const copy = grid.map(r => r.slice());
    return new SudokuState(copy);
  }

  static empty() {
    const grid = Array.from({ length: GRID_LENGTH }, () =>
      Array(GRID_LENGTH).fill(0)
    );
    return new SudokuState(grid);
  }

  private init() {
    for (let r = 0; r < GRID_LENGTH; r++) {
      for (let c = 0; c < GRID_LENGTH; c++) {
        const v = this.grid[r][c];
        if (v > 0) this.place(r, c, v);
      }
    }
  }

  boxIndex(row: number, col: number) {
    return (
      Math.floor(row / SQUARE_LENGTH) * SQUARE_LENGTH +
      Math.floor(col / SQUARE_LENGTH)
    );
  }

  isValid(row: number, col: number, val: number) {
    const b = this.boxIndex(row, col);
    return !this.rows[row][val] && !this.cols[col][val] && !this.boxes[b][val];
  }

  place(row: number, col: number, val: number) {
    const b = this.boxIndex(row, col);
    this.grid[row][col] = val;
    this.rows[row][val] = true;
    this.cols[col][val] = true;
    this.boxes[b][val] = true;
  }

  remove(row: number, col: number, val: number) {
    const b = this.boxIndex(row, col);
    this.grid[row][col] = 0;
    this.rows[row][val] = false;
    this.cols[col][val] = false;
    this.boxes[b][val] = false;
  }
}