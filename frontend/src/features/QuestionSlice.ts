import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// const BASE_URL = "https://restapi.pythonanywhere.com/api";
const BASE_URL = "http://localhost:8000/api";

function loadLocalStorageHighScores(): Score[] {
  const storedHighScores = localStorage.getItem("highScores");
  return storedHighScores ? JSON.parse(storedHighScores) : [];
}

function saveHighScoresToLocalStorage(highScores: Score[]) {
  localStorage.setItem("highScores", JSON.stringify(highScores));
}

type Question = {
  id: string;
  hint_image: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_answer: string;
};

type Score = {
  nickname: string;
  score: number;
};

type State = {
  fetching_questions_status: "idle" | "loading" | "succeeded" | "failed";
  questions: Question[];
  difficulty: string;
  settingsDeckView: boolean;
  isGameOver: boolean;
  highScores: Score[];
  showHighScoresBoard: boolean;
};

const initialState: State = {
  fetching_questions_status: "idle",
  questions: [],
  difficulty: "",
  settingsDeckView: false,
  isGameOver: false,
  highScores: loadLocalStorageHighScores(),
  showHighScoresBoard: false,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchQuestions: any = createAsyncThunk(
  "fetch/questions",
  async (choice: string) => {
    const response = await axios.get(`${BASE_URL}/quiz?difficulty=${choice}`);

    return response.data;
  },
);

export const QuestionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    getDifficulty(state, action) {
      state.difficulty = action.payload;
    },

    hideSettingsDeck(state) {
      state.settingsDeckView = false;
    },
    showSettingsDeck(state) {
      state.settingsDeckView = true;
    },

    setIsGameOver(state, action) {
      state.isGameOver = action.payload;
    },
    setNewHighScore(state, action) {
      state.highScores.unshift(action.payload);
      saveHighScoresToLocalStorage(state.highScores);
    },
    toggleHighScoresBoard(state, action) {
      state.showHighScoresBoard = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      //   fetching questions
      .addCase(fetchQuestions.pending, (state) => {
        state.fetching_questions_status = "loading";
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.fetching_questions_status = "succeeded";
        state.questions = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state) => {
        state.fetching_questions_status = "failed";
      });
  },
});

export default QuestionsSlice.reducer;
export const {
  getDifficulty,
  hideSettingsDeck,
  showSettingsDeck,
  setIsGameOver,
  setNewHighScore,
  toggleHighScoresBoard,
} = QuestionsSlice.actions;
export const questionsData = (state: { questions: State }) => state.questions;
