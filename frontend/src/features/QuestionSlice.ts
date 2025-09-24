import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// const BASE_URL = "https://restapi.pythonanywhere.com/api";
const BASE_URL = "http://127.0.0.1:8000/api";

type Question = {
  id: string;
  hint_image: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  user_choice: string;
  correct_answer: string;
  stage_status: string;
};

type State = {
  fetching_questions_status: "idle" | "loading" | "succeeded" | "failed";
  update_stage_status: "idle" | "loading" | "succeeded" | "failed";
  questions: Question[];
  difficulty: string;
  settingsDeckView: boolean;
};

const initialState: State = {
  fetching_questions_status: "idle",
  update_stage_status: "idle",
  questions: [],
  difficulty: "",
  settingsDeckView: false,
};

export const fetchQuestions: any = createAsyncThunk(
  "fetch/questions",
  async (choice: string) => {
    const response = await axios.get(`${BASE_URL}/quiz?difficulty=${choice}`);

    return response.data;
  }
);

type Payload = {
  id: string;
  status: string;
  user_choice: string;
};
export const updateStageStatus: any = createAsyncThunk(
  "update/stage_status",
  async (payload: Payload) => {
    const { id, status, user_choice } = payload;

    if (id) {
      const response = await axios.patch(
        `${BASE_URL}/quiz/${id}/`,
        {
          stage_status: status,
          user_choice: user_choice,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      return response.data;
    }
  }
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
      })

      // update stage status
      .addCase(updateStageStatus.pending, (state) => {
        state.update_stage_status = "loading";
      })
      .addCase(updateStageStatus.fulfilled, (state, action) => {
        state.update_stage_status = "succeeded";
        const foundQuestion = state.questions.find(
          (question) => question.id == action.payload.id
        );
        if (foundQuestion) {
          foundQuestion.stage_status = action.payload.stage_status;
        }
      })
      .addCase(updateStageStatus.rejected, (state) => {
        state.update_stage_status = "failed";
      });
  },
});

export default QuestionsSlice.reducer;
export const { getDifficulty, hideSettingsDeck, showSettingsDeck } =
  QuestionsSlice.actions;
export const questionsData = (state: { questions: State }) => state.questions;
