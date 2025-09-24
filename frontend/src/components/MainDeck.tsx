import { useSelector } from "react-redux";
import { questionsData } from "../features/QuestionSlice";
import "../css/MainDeck.css";
import { useNavigate } from "react-router-dom";
import { MdOutlineCheck } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";
import PlayButton from "./PlayButton";
import { IoArrowBackCircleOutline } from "react-icons/io5";
// import suspense from "/assets/suspense.mp3";

const MainDeck = () => {
  const { questions } = useSelector(questionsData);
  const navigate = useNavigate();

  return (
    <>
      <div className="main_deck">
        <IoArrowBackCircleOutline
          onClick={() => navigate("/")}
          className="back_icon"
        />

        <div className="flex justify-between items-center mb-[2rem]">
          <h2>Your Progress</h2>
          <PlayButton name={<IoSettingsOutline />} />
        </div>
        <div className="questions__boxes">
          {questions &&
            questions.map((question, index) => (
              <button
                disabled={
                  question.stage_status === "succeeded" ||
                  question.stage_status === "failed"
                }
                onClick={() => navigate(`/question_tub/${question.id}`)}
                className={
                  question.stage_status === "succeeded"
                    ? "stage_box correct"
                    : question.stage_status === "failed"
                    ? "stage_box incorrect"
                    : "stage_box"
                }
                key={index}
              >
                {question.stage_status === "succeeded" ? (
                  <MdOutlineCheck />
                ) : question.stage_status === "failed" ? (
                  <AiOutlineClose />
                ) : (
                  index + 1
                )}
              </button>
            ))}
        </div>
      </div>
    </>
  );
};

export default MainDeck;
