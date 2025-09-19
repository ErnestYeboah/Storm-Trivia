import { Route, Routes } from "react-router-dom";
import StartingPage from "./components/StartingPage";
import MainDeck from "./components/MainDeck";
import QuestionTub from "./components/QuestionTub";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchQuestions } from "./features/QuestionSlice";

function App() {
  const [user_userChoice] = useCookies(["user_userChoice"]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user_userChoice["user_userChoice"]) {
      dispatch(fetchQuestions(user_userChoice["user_userChoice"].difficulty));
    }
  }, [user_userChoice]);

  return (
    <>
      <Routes>
        <Route path="/" element={<StartingPage />} />
        <Route path="/main_deck" element={<MainDeck />} />
        <Route path="/question_tub/:id" element={<QuestionTub />} />
      </Routes>
    </>
  );
}

export default App;
