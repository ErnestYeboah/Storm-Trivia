import { useDispatch, useSelector } from "react-redux";
import { questionsData, setIsGameOver } from "../features/QuestionSlice";

const GameOverModal = ({
  score,
  onGameReset,
}: {
  score: number;
  onGameReset: () => void;
}) => {
  const { isGameOver } = useSelector(questionsData);
  const dispatch = useDispatch();

  const tryAgain = () => {
    dispatch(setIsGameOver(false));
    onGameReset();
  };

  return (
    <div
      className={
        isGameOver
          ? "game_over_modal_wrapper active"
          : "game_over_modal_wrapper"
      }
    >
      <div className="game_over_modal">
        <h1 className="text-3xl [font-family:var(--font-1)]">Game Over!</h1>
        {score === 0 ? (
          <p>You didn't score any points.</p>
        ) : (
          <p>YOUR NEW HIGH SCORE IS {score * 20} POINTS</p>
        )}
        <button onClick={tryAgain}>Try again</button>
      </div>
    </div>
  );
};

export default GameOverModal;
