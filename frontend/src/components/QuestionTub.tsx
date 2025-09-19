import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { questionsData, updateStageStatus } from "../features/QuestionSlice";
import "../css/MainDeck.css";
import { useEffect, useRef, useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import correctSound from "/assets/correct.mp3";
import wrongSound from "/assets/wrong.mp3";
import { useSound } from "react-sounds";
import { useCookies } from "react-cookie";

const TIMER = 30;
const NO_FIFTYFIFTY = 2;
const NO_SHOWANSWER = 2;

const QuestionTub = () => {
  const { id } = useParams();
  const { questions } = useSelector(questionsData);
  const [timer, setTimer] = useState(TIMER);
  const [no_fiftyfifty, setNoFiftyFifty] = useState(NO_FIFTYFIFTY);
  const [no_showAnswer, setNoShowAnswer] = useState(NO_SHOWANSWER);
  const dispatch = useDispatch();
  const { play: playcorrect } = useSound(correctSound);
  const { play: playWrong } = useSound(wrongSound);
  const [fifty_fifty_count, setFiftyFiftyCount] = useCookies([
    "fifty_fifty_count",
  ]);
  const [showAnswerCount, setHShowAnswerCount] = useCookies([
    "show_answer_count",
  ]);

  const foundQuestion = questions.find((question) => question.id == id);
  const option1Ref = useRef<HTMLButtonElement | null>(null);
  const option2Ref = useRef<HTMLButtonElement | null>(null);
  const option3Ref = useRef<HTMLButtonElement | null>(null);
  const option4Ref = useRef<HTMLButtonElement | null>(null);
  const allOptionRefs = [option1Ref, option2Ref, option3Ref, option4Ref];
  const navigate = useNavigate();

  const selectAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    const selectedOption = e.currentTarget.getAttribute("data-option");

    if (foundQuestion!.correct_answer === selectedOption) {
      e.currentTarget.style.backgroundColor = "green";
      playcorrect();
      dispatch(
        updateStageStatus({
          id: foundQuestion!.id,
          status: "succeeded",
          user_choice: selectedOption,
        })
      );
    } else {
      playWrong();
      e.currentTarget.style.backgroundColor = "red";
      dispatch(
        updateStageStatus({
          id: foundQuestion!.id,
          status: "failed",
          user_choice: selectedOption,
        })
      );
      highlightCorrectAnswer();
    }

    setTimeout(() => {
      navigate("/main_deck");
    }, 3000);
  };

  const highlightCorrectAnswer = () => {
    allOptionRefs.forEach((ref) => {
      if (
        ref.current!.getAttribute("data-option") ===
        foundQuestion?.correct_answer
      ) {
        (ref.current as HTMLButtonElement).style.backgroundColor = "green";
      }
    });
    playcorrect();

    setTimeout(() => {
      navigate("/main_deck");
    }, 1000);
  };

  // for timwer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timer]);

  useEffect(() => {
    if (timer === 0) {
      dispatch(updateStageStatus({ id: foundQuestion!.id, status: "failed" }));
      highlightCorrectAnswer();
    }
  }, [timer]);

  // show fifty fifty answers
  const showTwoOptions = () => {
    if (fifty_fifty_count["fifty_fifty_count"] !== 0) {
      allOptionRefs.map((ref) => {
        ref.current!.style.opacity = "0";
      });

      allOptionRefs.map((ref) => {
        if (ref.current?.dataset.option === foundQuestion?.correct_answer) {
          (ref.current as HTMLButtonElement).style.opacity = "1";
        }
      });

      const random = Math.floor(Math.random() * allOptionRefs.length);
      allOptionRefs[random].current!.style.opacity = "1";
      setNoFiftyFifty((x) => (x == 0 ? 0 : x - 1));
      setFiftyFiftyCount("fifty_fifty_count", Number(no_fiftyfifty - 1));
    }
  };

  const showCorrectAnswer = () => {
    if (showAnswerCount["show_answer_count"] !== 0) {
      highlightCorrectAnswer();
      dispatch(
        updateStageStatus({ id: foundQuestion!.id, status: "succeeded" })
      );
      setNoShowAnswer((x) => (x == 0 ? 0 : x - 1));
      setHShowAnswerCount("show_answer_count", Number(no_showAnswer - 1));
    }
  };

  return (
    <>
      <div className="overflow-hidden question_tub">
        <div className="timer">
          <p>⏰</p>
          {timer}
        </div>

        {foundQuestion && (
          <div className="question_deck">
            <figure>
              <img src={foundQuestion.hint_image} alt="" />
            </figure>
            <p>{foundQuestion.question}</p>
            <div className="options ">
              <button
                onClick={selectAnswer}
                ref={option1Ref}
                data-option={foundQuestion.option1}
              >
                {foundQuestion.option1}
              </button>
              <button
                onClick={selectAnswer}
                ref={option2Ref}
                data-option={foundQuestion.option2}
              >
                {foundQuestion.option2}
              </button>
              <button
                onClick={selectAnswer}
                ref={option3Ref}
                data-option={foundQuestion.option3}
              >
                {foundQuestion.option3}
              </button>
              <button
                onClick={selectAnswer}
                ref={option4Ref}
                data-option={foundQuestion.option4}
              >
                {foundQuestion.option4}
              </button>
            </div>
          </div>
        )}

        <div className="cheat_tab">
          <button
            disabled={
              fifty_fifty_count["fifty_fifty_count"] === 0 ? true : false
            }
            onClick={showTwoOptions}
          >
            <span className="remainder">
              {fifty_fifty_count["fifty_fifty_count"] || no_fiftyfifty}
            </span>
            <span>50/</span>
            <span>50</span>
          </button>
          <button
            disabled={showAnswerCount["show_answer_count"] == 0 ? true : false}
            onClick={showCorrectAnswer}
          >
            <span className="remainder">
              {showAnswerCount["show_answer_count"] || no_showAnswer}
            </span>
            <FaCircleCheck />
          </button>
        </div>
      </div>
    </>
  );
};

export default QuestionTub;
