import { configureStore } from "@reduxjs/toolkit";
import questionsReducer from "../features/QuestionSlice";

export const store = configureStore({
  reducer: {
    questions: questionsReducer,
  },
});
