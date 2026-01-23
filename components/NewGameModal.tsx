import { formatTime } from "@/lib/sudoku/time-formatter";
import type { Difficulty } from "../lib/sudoku/types";
import "./NewGameModal.css";

interface Props {
  gameFinished: boolean;
  seconds: number;
  mistakes: number;
  onSelectDifficulty: (d: Difficulty) => void;
  onClose: () => void;
}

export default function NewGameModal({ gameFinished, seconds, mistakes, onSelectDifficulty, onClose }: Props) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="modal-close" onClick={() => onClose()} aria-label="Close">
          <strong>✕</strong>
        </button>

        {gameFinished && (
          <>
            <h2>Congratulations 🎉</h2>
            <p>Time: {formatTime(seconds)}</p>
            <p>Mistakes: {mistakes}</p>
          </>
        )}

        <h3>Start a New Game</h3>
        <div className="difficulty">
          {(["Easy", "Medium", "Hard"] as Difficulty[]).map(d => (
            <button key={d} onClick={() => onSelectDifficulty(d)}>
              {d}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}