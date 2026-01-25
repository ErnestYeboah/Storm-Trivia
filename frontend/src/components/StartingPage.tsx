import { useDispatch } from "react-redux";
import "../css/StartingPage.css";
import HighScoreBoard from "./HighScoreBoard";
import PlayButton from "./PlayButton";
import { toggleHighScoresBoard } from "../features/QuestionSlice";

const StartingPage = () => {
  const dispatch = useDispatch();

  return (
    <>
      <div className="starting_page">
        <div className="text_content">
          <h2 className="split-text-container">
            <span className="text-part left">Storm</span>{" "}
            <span className="text-part right">Trivia</span>
          </h2>
          <div className="buttons_container space-y-4">
            <PlayButton name={"Play"} />
            <button onClick={() => dispatch(toggleHighScoresBoard(true))}>
              Your HighScores
            </button>
          </div>
        </div>
        <HighScoreBoard />
      </div>
    </>
  );
};

export default StartingPage;
