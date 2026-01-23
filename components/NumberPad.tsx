import "./NumberPad.css";

interface NumberPadProps {
  counts: number[];
  onNumberClick: (value: number) => void;
}

export default function NumberPad({ counts, onNumberClick }: NumberPadProps) {
  return (
    <div className="panel-section number-pad">
      {counts.map((count, i) => {
        const value = i + 1;
        return (
          <button
            key={value}
            className="num-btn"
            disabled={count >= 9}
            onClick={() => onNumberClick(value)}
          >
            {value}
          </button>
        );
      })}
    </div>
  );
}