import { useState, useEffect } from "react";

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isUserTurn, setIsUserTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);

  const patterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  // 🏆 Winner Check + store winning cells
  const checkWinner = (board) => {
    for (let [a,b,c] of patterns) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinningCells([a,b,c]);
        return board[a];
      }
    }
    return null;
  };

  // 😈 MINIMAX
  const minimax = (newBoard, isMax) => {
    const win = checkStaticWinner(newBoard);

    if (win === "O") return 1;
    if (win === "X") return -1;
    if (!newBoard.includes(null)) return 0;

    if (isMax) {
      let best = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!newBoard[i]) {
          newBoard[i] = "O";
          let score = minimax(newBoard, false);
          newBoard[i] = null;
          best = Math.max(score, best);
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!newBoard[i]) {
          newBoard[i] = "X";
          let score = minimax(newBoard, true);
          newBoard[i] = null;
          best = Math.min(score, best);
        }
      }
      return best;
    }
  };

  // Static winner (no state change)
  const checkStaticWinner = (b) => {
    for (let [a,b1,c] of patterns) {
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
    }
    return null;
  };

  const getBestMove = () => {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "O";
        let score = minimax(board, false);
        board[i] = null;

        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  };

  // 👤 User
  const handleClick = (i) => {
    if (board[i] || winner || !isUserTurn) return;

    const newBoard = [...board];
    newBoard[i] = "X";

    setBoard(newBoard);
    setIsUserTurn(false);
  };

  // 🤖 AI
  const computerMove = () => {
    const move = getBestMove();
    if (move === undefined) return;

    const newBoard = [...board];
    newBoard[move] = "O";

    setBoard(newBoard);
    setIsUserTurn(true);
  };

  useEffect(() => {
    if (!isUserTurn && !winner && board.includes(null)) {
      const t = setTimeout(computerMove, 400);
      return () => clearTimeout(t);
    }
  }, [isUserTurn, board, winner]);

  useEffect(() => {
    const win = checkWinner(board);

    if (win) setWinner(win);
    else if (!board.includes(null)) setWinner("Draw");
  }, [board]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setWinningCells([]);
    setIsUserTurn(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-gray-900 to-black text-white">

      <h1 className="text-5xl font-extrabold mb-6 tracking-wide">
        Tic Tac Toe ✨
      </h1>

      {/* Turn Indicator */}
      <p className="mb-4 text-lg">
        {winner
          ? winner === "Draw"
            ? "Draw 🤝"
            : winner === "X"
            ? "You Win 😎"
            : "AI Wins 💀"
          : isUserTurn
          ? "Your Turn 🟢"
          : "AI Thinking... 🤖"}
      </p>

      {/* Board */}
      <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-lg shadow-2xl">

        {board.map((val, i) => (
          <div
            key={i}
            onClick={() => handleClick(i)}
            className={`
              w-24 h-24 flex items-center justify-center text-4xl font-bold rounded-xl cursor-pointer
              transition-all duration-300
              
              ${winningCells.includes(i)
                ? "bg-green-500 scale-110"
                : "bg-white/10 hover:bg-white/20 hover:scale-105"}
              
              ${val === "X" ? "text-blue-400 drop-shadow-[0_0_10px_#60a5fa]" : ""}
              ${val === "O" ? "text-red-400 drop-shadow-[0_0_10px_#f87171]" : ""}
            `}
          >
            {val}
          </div>
        ))}

      </div>

      {/* Button */}
      <button
        onClick={resetGame}
        className="mt-6 px-6 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105 transition-all"
      >
        Restart 🔄
      </button>

    </div>
  );
}

export default App;