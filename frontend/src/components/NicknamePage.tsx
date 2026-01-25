import { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideSettingsDeck, questionsData } from "../features/QuestionSlice";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
const NO_FIFTYFIFTY = 2;
const NO_SHOWANSWER = 2;

const NicknamePage = () => {
  const [nickname, setNickname] = useState("");
  const { difficulty } = useSelector(questionsData);
  const [error, setError] = useState("");
  const [user_userChoice, setUser_UserChoice] = useCookies(["user_userChoice"]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [, setFiftyFiftyCount] = useCookies(["fifty_fifty_count"]);
  const [, setShowAnswerCount] = useCookies(["show_answer_count"]);

  const saveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname || user_userChoice["user_userChoice"]) {
      setUser_UserChoice("user_userChoice", {
        difficulty: difficulty,
        nickname: nickname,
      });
      navigate("/question_tub");
      dispatch(hideSettingsDeck());
      setFiftyFiftyCount("fifty_fifty_count", Number(NO_FIFTYFIFTY));
      setShowAnswerCount("show_answer_count", Number(NO_SHOWANSWER));
    } else {
      setError("Please enter your nickname to continue");
    }
  };

  return (
    <>
      <form className="nickname_modal" onSubmit={saveSettings}>
        <h2>Enter your nickname </h2>
        <input
          type="text"
          name="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder={
            user_userChoice["user_userChoice"]
              ? user_userChoice["user_userChoice"].nickname
              : "Enter your nickname"
          }
        />
        <button type="submit">Save</button>
      </form>
      <p className=" error mt-[1rem] ">{error}</p>
    </>
  );
};

export default memo(NicknamePage);
