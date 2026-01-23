"use client";

import SudokuGrid from "@/components/SudokuGrid";
import NumberPad from "@/components/NumberPad";
import "./SudokuGame.css";
import NewGameModal from "./NewGameModal";
import { formatTime } from "@/lib/sudoku/time-formatter";
import { useSudokuGame } from "@/hooks/useSudokuGame";

export default function SudokuGame() {
  const game = useSudokuGame();

  return (
    <div className="app-container">
      <h1><strong>Sudoku</strong></h1>

      <div className="game-layout">
        <div className="game-left">
          <SudokuGrid
            grid={game.grid}
            initialGrid={game.initialGrid}
            solution={game.solution}
            selectedCell={game.selectedCell}
            candidates={game.candidates}
            onCellChange={game.setCell}
            onCellClick={game.selectCell}
            onArrowKey={game.handleArrowKey}
           />
        </div>

        <div className="game-right">
          <div className="panel-section stats">
            <div>Difficulty: <strong>{game.difficulty}</strong></div>
            <div>Time: <strong>{formatTime(game.seconds)}</strong></div>
            <div>Mistakes: <strong>{game.mistakes}</strong></div>
          </div>

          <NumberPad
            counts={game.numberCounts}
            onNumberClick={game.setNumber}
           />

          <div className="panel-section actions">
            <button className="icon-btn undo" onClick={game.undo} disabled={game.history.length === 0} title="Undo">↺</button>
            <button className="icon-btn erase" onClick={game.erase} title="Erase">⌫</button>
            <label>
              <input type="checkbox" checked={game.showCandidates} onChange={(e) => game.setShowCandidates(e.target.checked)} />
              Candidates
            </label>
          </div>

          <div className="new-game">
            <button onClick={() => game.setShowNewGameModal(true)}>New Game</button>
          </div>
        </div>
      </div>

      {game.showNewGameModal && (
        <NewGameModal
          gameFinished={game.solved}
          seconds={game.seconds}
          mistakes={game.mistakes}
          onSelectDifficulty={(d) => {
            game.setDifficulty(d);
            game.startNewGame(d);
          }}
          onClose={() => game.setShowNewGameModal(false)}
        />
      )}
    </div>
  );
}