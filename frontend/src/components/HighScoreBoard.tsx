import { useDispatch, useSelector } from "react-redux";
import {
  questionsData,
  toggleHighScoresBoard,
} from "../features/QuestionSlice";
import { BsDoorClosed } from "react-icons/bs";

const HighScoreBoard = () => {
  const { showHighScoresBoard, highScores } = useSelector(questionsData);
  const dispatch = useDispatch();
  return (
    <div
      className={
        showHighScoresBoard
          ? "high_scores_wrapper active"
          : "high_scores_wrapper"
      }
    >
      <div className="high_scores_board p-4">
        <div className="crown">
          <img src="/Crown_PNG_Template_Transparent_Background_V1.png" alt="" />
        </div>
        <div className="flex justify-end">
          <BsDoorClosed
            onClick={() => dispatch(toggleHighScoresBoard(false))}
            className="text-2xl text-red-600 cursor-pointer hover:scale-110"
          />
        </div>
        <h1 className="text-center mb-2">You High Scores</h1>
        <ul>
          {highScores &&
            highScores.map((item, index) => (
              <li key={index} className="flex justify-between mb-2">
                <span>{item.nickname} </span> - <span>{item.score} POINTS</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default HighScoreBoard;
