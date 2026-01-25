import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  questionsData,
  setIsGameOver,
  setNewHighScore,
} from "../features/QuestionSlice";
import "../css/MainDeck.css";
import React, { useEffect, useRef, useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { useSound } from "react-sounds";
import { useCookies } from "react-cookie";
import { IoArrowBackCircleOutline, IoSettingsOutline } from "react-icons/io5";
import PlayButton from "./PlayButton";
import GameOverModal from "./GameOverModal";
import { FaHeartbeat } from "react-icons/fa";

const TIMER = 99999999;
const DELAY = 1000;

const QuestionTub = () => {
  const { questions } = useSelector(questionsData);
  const [fifty_fifty_count, setFiftyFiftyCount] = useCookies([
    "fifty_fifty_count",
  ]);
  const [showAnswerCount, setShowAnswerCount] = useCookies([
    "show_answer_count",
  ]);

  const getRandomIndex = () => {
    return Math.floor(Math.random() * questions.length);
  };
  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(getRandomIndex());
  const [timer, setTimer] = useState(TIMER);
  const [no_showAnswer] = useState(showAnswerCount["show_answer_count"]);
  const [no_fiftyfifty] = useState(fifty_fifty_count["fifty_fifty_count"]);
  const { play: playcorrect } = useSound("notification/info");
  const { play: playWrong } = useSound("notification/error");

  const mainQuestion = questions && questions[currentQuestionIndex];
  const option1Ref = useRef<HTMLButtonElement | null>(null);
  const option2Ref = useRef<HTMLButtonElement | null>(null);
  const option3Ref = useRef<HTMLButtonElement | null>(null);
  const option4Ref = useRef<HTMLButtonElement | null>(null);
  const allOptionRefs = [option1Ref, option2Ref, option3Ref, option4Ref];
  const fiftyfiftyBtnRef = useRef<HTMLButtonElement | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(2);
  const [cookies] = useCookies(["user_userChoice"]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const resetButtonStyles = () => {
    allOptionRefs.forEach((ref) => (ref.current!.style.backgroundColor = ""));
  };

  const resetGame = () => {
    setCurrentQuestionIndex(getRandomIndex());
    setScore(0);
    setTimer(TIMER);
    setLives(2);
  };

  const selectAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    const selectedOption = e.currentTarget.getAttribute("data-option");
    fiftyfiftyBtnRef.current!.disabled = false;

    if (mainQuestion?.correct_answer === selectedOption) {
      e.currentTarget.style.backgroundColor = "green";
      playcorrect();
      setScore(score + 1);
      nextQuestion();
    } else {
      playWrong(); //play sound
      e.currentTarget.style.backgroundColor = "red";
      highlightCorrectAnswer();
      setLives(lives - 1);
    }
  };

  useEffect(() => {
    console.log(currentQuestionIndex);
  }, [currentQuestionIndex]);

  const nextQuestion = () => {
    setTimeout(() => {
      resetButtonStyles();
      setCurrentQuestionIndex((p) =>
        p === getRandomIndex() ? getRandomIndex() : getRandomIndex(),
      );
      setTimer(TIMER);
    }, DELAY);
  };

  // for checking lives
  useEffect(() => {
    if (lives === 0) {
      dispatch(setIsGameOver(true));
      if (score !== 0) {
        dispatch(
          setNewHighScore({
            nickname: cookies["user_userChoice"]?.nickname,
            score: score * 20,
          }),
        );
      }
    }
  }, [cookies, dispatch, lives, score]);

  const highlightCorrectAnswer = () => {
    allOptionRefs.forEach((ref) => {
      if (
        ref.current!.getAttribute("data-option") === mainQuestion.correct_answer
      ) {
        (ref.current as HTMLButtonElement).style.backgroundColor = "green";
      }
    });

    nextQuestion();
  };

  // for timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timer]);

  useEffect(() => {
    if (timer === 0) {
      setLives((p) => p - 1);
      highlightCorrectAnswer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer]);

  // show fifty fifty answers
  const showTwoOptions = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.disabled = true;
    allOptionRefs.map((btn) =>
      (btn.current as HTMLButtonElement).classList.add("opaque"),
    );

    const correctAnswerOption = allOptionRefs.find(
      (btn) =>
        (btn.current as HTMLButtonElement).dataset.option ==
        mainQuestion.correct_answer,
    );
    if (correctAnswerOption) {
      correctAnswerOption.current!.classList.remove("opaque");
    }

    const randomIndex = Math.floor(Math.random() * 4);
    allOptionRefs[randomIndex].current!.classList.remove("opaque");
    setFiftyFiftyCount(
      "fifty_fifty_count",
      no_fiftyfifty == 0 ? 0 : Number(no_fiftyfifty) - 1,
    );
  };

  const showCorrectAnswer = () => {
    if (showAnswerCount["show_answer_count"] !== 0) {
      highlightCorrectAnswer();

      setShowAnswerCount(
        "show_answer_count",
        no_showAnswer == 0 ? 0 : Number(no_showAnswer) - 1,
      );
    }
  };

  return (
    <>
      <GameOverModal score={score} onGameReset={resetGame} />
      <div className="flex justify-between items-center py-1 px-4">
        <IoArrowBackCircleOutline
          onClick={() => navigate("/")}
          className="back_icon"
        />
        <div className="timer mb-2">
          <p>⏰</p>
          {timer}
        </div>

        <div className="flex gap-2 items-center ">
          <FaHeartbeat className="text-red-600 text-2xl" /> ~ <p>{lives}</p>
        </div>
        <h2 className="large_screen_points">Scores : {score * 20} POINTS</h2>
        <h2 className="small_screen_points">{score * 20}</h2>

        <PlayButton name={<IoSettingsOutline />} />
      </div>

      <div className="overflow-hidden">
        <div className="question_deck">
          <figure>
            <img src={mainQuestion?.hint_image} alt="" />
          </figure>
          <p className="text-[1rem]">{mainQuestion?.question}</p>
          <div className="options ">
            <button
              onClick={selectAnswer}
              ref={option1Ref}
              data-option={mainQuestion?.option1}
            >
              {mainQuestion?.option1}
            </button>
            <button
              onClick={selectAnswer}
              ref={option2Ref}
              data-option={mainQuestion?.option2}
            >
              {mainQuestion?.option2}
            </button>
            <button
              onClick={selectAnswer}
              ref={option3Ref}
              data-option={mainQuestion?.option3}
            >
              {mainQuestion?.option3}
            </button>
            <button
              onClick={selectAnswer}
              ref={option4Ref}
              data-option={mainQuestion?.option4}
            >
              {mainQuestion?.option4}
            </button>
          </div>
        </div>

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
