export function loadGameState() {
  return {
    initialGrid: JSON.parse(localStorage.getItem("sudoku-grid-initial") ?? "null"),
    grid: JSON.parse(localStorage.getItem("sudoku-grid") ?? "null"),
    mistakes: Number(localStorage.getItem("sudoku-mistakes") ?? 0),
    seconds: Number(localStorage.getItem("sudoku-time") ?? 0),
    solved: JSON.parse(localStorage.getItem("sudoku-solved") ?? "false"),
    showCandidates: JSON.parse(localStorage.getItem("sudoku-show-candidates") ?? "false"),
    difficulty: JSON.parse(localStorage.getItem("sudoku-difficulty") ?? "null"),
    history: JSON.parse(localStorage.getItem("sudoku-history") ?? "[]"),
  };
}

export function saveGameState(partial: Record<string, unknown>) {
  Object.entries(partial).forEach(([k, v]) =>
    localStorage.setItem(k, JSON.stringify(v))
  );
}