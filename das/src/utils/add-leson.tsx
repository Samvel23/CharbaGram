import { useState } from "react";
import { addLesson } from "../features/classbook/classbook.slice";
import { useAppDispatch } from "../app/hooks";

export const AddLesson = () => {
  const [text, setText] = useState<string>("");
  const dispatch = useAppDispatch();
  const handleSubmit = () => {
    dispatch(addLesson({ title: text, ratings: [] }))
      .unwrap()
      .then((res) => setText(""));
  };
  return (
    <>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key == "Enter" && handleSubmit()}
      />
    </>
  );
};
