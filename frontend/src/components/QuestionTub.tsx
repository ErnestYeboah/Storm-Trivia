import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { questionsData, updateStageStatus } from "../features/QuestionSlice";
import "../css/MainDeck.css";
import React, { useEffect, useRef, useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import correctSound from "/assets/correct.mp3";
import wrongSound from "/assets/wrong.mp3";
import { useSound } from "react-sounds";
import { useCookies } from "react-cookie";

const TIMER = 30;
const DELAY = 3000;

const QuestionTub = () => {
  const { id } = useParams();
  const { questions } = useSelector(questionsData);
  const [fifty_fifty_count, setFiftyFiftyCount] = useCookies([
    "fifty_fifty_count",
  ]);
  const [showAnswerCount, setShowAnswerCount] = useCookies([
    "show_answer_count",
  ]);
  const [timer, setTimer] = useState(TIMER);
  const [no_showAnswer] = useState(showAnswerCount["show_answer_count"]);
  const [no_fiftyfifty] = useState(fifty_fifty_count["fifty_fifty_count"]);
  const dispatch = useDispatch();
  const { play: playcorrect } = useSound(correctSound);
  const { play: playWrong } = useSound(wrongSound);

  const foundQuestion = questions.find((question) => question.id == id);
  const option1Ref = useRef<HTMLButtonElement | null>(null);
  const option2Ref = useRef<HTMLButtonElement | null>(null);
  const option3Ref = useRef<HTMLButtonElement | null>(null);
  const option4Ref = useRef<HTMLButtonElement | null>(null);
  const allOptionRefs = [option1Ref, option2Ref, option3Ref, option4Ref];
  const fiftyfiftyBtnRef = useRef<HTMLButtonElement | null>(null);
  const navigate = useNavigate();

  const selectAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    const selectedOption = e.currentTarget.getAttribute("data-option");
    fiftyfiftyBtnRef.current!.disabled = false;
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
    }, DELAY);
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
    }, DELAY);
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
  const showTwoOptions = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.disabled = true;
    allOptionRefs.map((btn) =>
      (btn.current as HTMLButtonElement).classList.add("opaque")
    );

    const correctAnswerOption = allOptionRefs.find(
      (btn) =>
        (btn.current as HTMLButtonElement).dataset.option ==
        foundQuestion!.correct_answer
    );
    if (correctAnswerOption) {
      correctAnswerOption.current!.classList.remove("opaque");
    }

    const randomIndex = Math.floor(Math.random() * 4);
    allOptionRefs[randomIndex].current!.classList.remove("opaque");
    setFiftyFiftyCount(
      "fifty_fifty_count",
      no_fiftyfifty == 0 ? 0 : Number(no_fiftyfifty) - 1
    );
  };

  const showCorrectAnswer = () => {
    if (showAnswerCount["show_answer_count"] !== 0) {
      highlightCorrectAnswer();
      dispatch(
        updateStageStatus({ id: foundQuestion!.id, status: "succeeded" })
      );
      setShowAnswerCount(
        "show_answer_count",
        no_showAnswer == 0 ? 0 : Number(no_showAnswer) - 1
      );
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
          <button ref={fiftyfiftyBtnRef} onClick={showTwoOptions}>
            <span className="remainder">
              {fifty_fifty_count["fifty_fifty_count"]}
            </span>
            <span>50/</span>
            <span>50</span>
          </button>
          <button
            disabled={showAnswerCount["show_answer_count"] == 0 ? true : false}
            onClick={showCorrectAnswer}
          >
            <span className="remainder">
              {showAnswerCount["show_answer_count"]}
            </span>
            <FaCircleCheck />
          </button>
        </div>
      </div>
    </>
  );
};

export default QuestionTub;
