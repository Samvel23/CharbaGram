import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { InputLesson, IState } from "./types";
import axios from "axios";

const initialState: IState = {
  lessons: [],
};

export const getLesson = createAsyncThunk("lessons/get", async () => {
  const response = await axios.get("http://localhost:3004/lessons");
  return response.data;
});

export const addLesson = createAsyncThunk(
  "lessons/add",
  async (param: InputLesson) => {
    const response = await axios.post("http://localhost:3004/lessons", param);
    return response.data;
  }
);

export const addRating = createAsyncThunk(
  "lessons/rating",
  async ({ lessonId, studentId, rate }: { lessonId: number, studentId: number, rate: number }) => {
    const response = await axios.patch(`http://localhost:3004/lessons/${lessonId}/ratings`, {studentId, rate});
    return response.data;
  }
);
const ClassBookSlice = createSlice({
  name: "classbook",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLesson.fulfilled, (state, action) => {
        state.lessons = action.payload;
      })
      .addCase(addLesson.fulfilled, (state, action) => {
        state.lessons.push(action.payload);
      })
      .addCase(addRating.fulfilled, (state, action) => {
        state.lessons.map((lesson) => {
          if (lesson.id === action.payload.id) {
            lesson.ratings = [...lesson.ratings, action.payload.rating];
          }
        });
      });
  },
});

export const classReducer = ClassBookSlice.reducer;
