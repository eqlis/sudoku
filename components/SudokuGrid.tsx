"use client";

import SudokuCell from "./SudokuCell";
import "./SudokuGrid.css";

interface SudokuGridProps {
  grid: number[][];
  initialGrid: number[][];
  solution: number[][];
  selectedCell: { row: number; col: number };
  candidates: Set<number>[][] | null;
  onCellChange: (row: number, col: number, value: number) => void;
  onCellClick: (row: number, col: number) => void;
  onArrowKey: (row: number, col: number, key: string) => void;
}

function highlight(row: number, col: number, sr: number, sc: number) {
  if (row === sr && col === sc) return false;
  return row === sr || col === sc || isInTheSameBox(row, col, sr, sc);
}

function isInTheSameBox(r1: number, c1: number, r2: number, c2: number) {
  return Math.floor(r1 / 3) === Math.floor(r2 / 3) &&
         Math.floor(c1 / 3) === Math.floor(c2 / 3);
}

export default function SudokuGrid({
  grid,
  initialGrid,
  solution,
  selectedCell,
  candidates,
  onCellChange,
  onCellClick,
  onArrowKey,
}: SudokuGridProps) {
  return (
    <div className="sudoku-grid">
      {grid.map((row, r) => (
        <div key={r} className="sudoku-row">
          {row.map((value, c) => (
            <SudokuCell 
              key={c}
              row={r}
              col={c}
              value={value}
              solutionValue={solution[r][c]}
              readOnly={initialGrid[r][c] !== 0}
              highlight={highlight(r, c, selectedCell.row, selectedCell.col)}
              highlightValue={value !== 0 && value === grid[selectedCell.row][selectedCell.col]}
              isSelected={r === selectedCell?.row && c === selectedCell?.col}
              candidates={candidates ? candidates[r][c] : undefined}
              onCellChange={onCellChange}
              onClick={() => onCellClick(r, c)}
              onArrowKey={(key) => onArrowKey(r, c, key)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}