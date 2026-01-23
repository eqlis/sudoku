import { useEffect, useRef } from "react";
import "./SudokuCell.css";

interface SudokuCellProps {
  row: number;
  col: number;
  value: number;
  readOnly: boolean;
  solutionValue: number;
  highlight: boolean;
  highlightValue: boolean;
  isSelected: boolean;
  candidates?: Set<number>;
  onCellChange?: (row: number, col: number, value: number) => void;
  onClick: () => void;
  onArrowKey: (key: string) => void;
}

export default function SudokuCell({
  row,
  col,
  value,
  readOnly,
  solutionValue, 
  highlight,
  highlightValue,
  isSelected,
  candidates,
  onCellChange,
  onClick,
  onArrowKey
}: SudokuCellProps) {
  const wrapperClasses = ["sudoku-cell-wrapper"];
  if (col % 3 === 0) wrapperClasses.push("border-left");
  if (row % 3 === 0) wrapperClasses.push("border-top");
  if (col === 8) wrapperClasses.push("border-right");
  if (row === 8) wrapperClasses.push("border-bottom");
  const classes = ["sudoku-cell"];
  if (readOnly) classes.push("prefilled");
  if (value > 0 && solutionValue > 0 && value !== solutionValue) classes.push("invalid");
  if (highlight) classes.push("highlight");
  if (highlightValue) classes.push("highlight-value");
  if (isSelected) classes.push("selected");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSelected) {
      inputRef.current?.focus();
    }
  }, [isSelected]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      onCellChange?.(row, col, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key.startsWith("Arrow")) {
      e.preventDefault();
      onArrowKey(e.key);
      return;
    }

    if (readOnly) return;

    if (e.key >= "1" && e.key <= "9") {
      e.preventDefault();
      onCellChange?.(row, col, Number(e.key));
      return;
    }

    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      onCellChange?.(row, col, 0);
      return;
    }
  }

  return (
    <div className={wrapperClasses.join(" ")} onClick={onClick}>
      <input
        type="text"
        inputMode="numeric"
        className={classes.join(" ")}
        value={value || ""}
        ref={inputRef}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        readOnly={readOnly}
      />
      {value === 0 && candidates && (
        <div className="candidates">
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <span
              key={n}
              className={candidates.has(n) ? "" : "off"}
            >
              {n}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}