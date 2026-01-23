"use client";

import { useEffect, useMemo, useState } from "react";
import { generateGrid } from "@/lib/sudoku/generator";
import { solve } from "@/lib/sudoku/solver";
import { computeCandidates } from "@/lib/sudoku/candidates";
import { Difficulty } from "@/lib/sudoku/types";
import { loadGameState, saveGameState } from "@/lib/sudoku/persistence";

interface Move {
  row: number;
  col: number;
  value: number;
}

export function useSudokuGame() {
  const [initialGrid, setInitialGrid] = useState<number[][]>([]);
  const [grid, setGrid] = useState<number[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });
  const [solved, setSolved] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [showCandidates, setShowCandidates] = useState(false);
  const [history, setHistory] = useState<Move[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>("Easy");
  const [showNewGameModal, setShowNewGameModal] = useState(false);

  useEffect(() => {
    const gameState = loadGameState();

    let generated = gameState.initialGrid
      ? gameState.initialGrid
      : generateGrid(difficulty);

    let currentGrid = gameState.grid
      ? gameState.grid
      : generated.map((r: number[]) => r.slice());

    setMistakes(gameState.mistakes);
    setSeconds(gameState.seconds);
    setShowCandidates(gameState.showCandidates);
    setSolved(gameState.solved);
    setDifficulty(gameState.difficulty? gameState.difficulty : "Easy");
    setHistory(gameState.history);

    setInitialGrid(generated);
    setGrid(currentGrid);
    setSolution(solve(generated));
  }, []);

  useEffect(() => {
    saveGameState({
      "sudoku-time": seconds,
      "sudoku-mistakes": mistakes,
      "sudoku-show-candidates": showCandidates,
      "sudoku-grid": grid,
      "sudoku-grid-initial": initialGrid,
      "sudoku-solved": solved,
      "sudoku-difficulty": difficulty,
      "sudoku-history": history,
    });
  }, [seconds, mistakes, showCandidates, grid, initialGrid, solved, difficulty, history]);

  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning]);

  useEffect(() => {
    if (solved) {
      setIsRunning(false);
      setShowNewGameModal(true);
    }
  }, [solved]);

  const setCell = (row: number, col: number, value: number) => {
    if (initialGrid[row][col] !== 0) return;

    const prev = grid[row][col];
    if (prev === value) return;

    setHistory(h => [...h, { row, col, value: prev }]);

    const newGrid = grid.map(r => r.slice());
    newGrid[row][col] = value;

    setGrid(newGrid);
    setSelectedCell({ row, col });

    if (value > 0 && value !== solution[row][col]) {
      setMistakes(mistakes + 1);
    }

    if (solution.length &&
        newGrid.every((r, i) => r.every((v, j) => v === solution[i][j]))) {
      setSolved(true);
    }
  };

  const selectCell  = (row: number, col: number) => {
    setSelectedCell({ row, col });
  };

  const handleArrowKey = (row: number, col: number, key: string) => {
    let newRow = row;
    let newCol = col;
    switch (key) {
      case "ArrowUp": newRow = Math.max(0, row - 1);
      break;
      case "ArrowDown": newRow = Math.min(8, row + 1);
      break;
      case "ArrowLeft": newCol = Math.max(0, col - 1);
      break;
      case "ArrowRight": newCol = Math.min(8, col + 1);
      break;
    }
    setSelectedCell({ row: newRow, col: newCol });
  };

  const setNumber = (value: number) => {
    const { row, col } = selectedCell;
    if (initialGrid[row][col] !== 0) return;
    setCell(row, col, value);
  };

  const startNewGame = (d: Difficulty) => {
    const generated = generateGrid(d);
    setInitialGrid(generated);
    setGrid(generated.map(r => r.slice()));
    setSolution(solve(generated));
    setSelectedCell({ row: 0, col: 0 });
    setSolved(false);
    setMistakes(0);
    setSeconds(0);
    setIsRunning(true);
    setHistory([]);
    setShowNewGameModal(false);
  };

  const undo = () => {
    setHistory(h => {
      if (h.length === 0) return h;

      const last = h[h.length - 1];

      setGrid(g => {
        const copy = g.map(r => r.slice());
        copy[last.row][last.col] = last.value;
        return copy;
      });

      setSelectedCell({ row: last.row, col: last.col });

      return h.slice(0, -1);
    });
  };

  const erase = () => {
    const { row, col } = selectedCell;
    if (initialGrid[row][col] !== 0) return;
    setCell(row, col, 0);
  };

  const numberCounts = useMemo(() => {
    const counts = Array(9).fill(0);
    grid.forEach(r =>
      r.forEach(v => {
        if (v > 0) counts[v - 1]++;
      })
    );
    return counts;
  }, [grid]);

  const candidates = useMemo(
    () => (showCandidates ? computeCandidates(grid) : null),
    [grid, showCandidates]
  );

  return {
    initialGrid,
    grid,
    solution,
    selectedCell,
    solved,
    mistakes,
    seconds,
    showCandidates,
    history,
    difficulty,
    showNewGameModal,
    numberCounts,
    candidates,

    setCell,
    selectCell,
    handleArrowKey,
    setNumber,
    undo,
    erase,
    setShowCandidates,
    setShowNewGameModal,
    setDifficulty,
    startNewGame,
  };
}