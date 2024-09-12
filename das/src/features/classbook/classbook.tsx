import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useEffect, useState } from "react";
import { getAllStudents } from "../students/students.slice";
import { addRating, getLesson } from "./classbook.slice";
import style from "./style.module.css";
import { AddLesson } from "../../utils/add-leson";

export const ClassBook = () => {
  const students = useAppSelector((state) => state.students.list);
  const dispatch = useAppDispatch();
  const lessons = useAppSelector((state) => state.classbook.lessons);
  const [ratingInput, setRatingInput] = useState<number>();
  const [selected, setSelected] = useState<{
    studentId: string;
    lessonId: string;
  } | null>(null);

  const empty = new Array(16 - lessons.length).fill(null);

  useEffect(() => {
    dispatch(getAllStudents());
    dispatch(getLesson());
  }, [dispatch]);

  const openContainer = (studentId: string, lessonId: string) => {
    setSelected({ studentId, lessonId });
  };

  const closeContainer = () => {
    setSelected(null);
  };

  return (
    <>
      <h3>classbook</h3>
      <Link to="/students">Students</Link>
      <p>students {students.length}</p>
      <p>lessons {lessons.length}</p>
      <table className={style.table}>
        <thead>
          <tr>
            <th rowSpan={2}>Student</th>
            <th colSpan={16}>Lessons</th>
          </tr>
          <tr>
            {lessons.map((lesson) => (
              <th key={lesson.id} className={style.vertical}>
                {lesson.title}
              </th>
            ))}
            {empty.map((_, index) => (
              <th key={index}></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>
                {student.name} {student.surname}
              </td>
              {lessons.map((lesson) => {
                const found = lesson.ratings.find(
                  (r) => r.student === student.id
                );

                return (
                  <td key={lesson.id}>
                    {found ? (
                      found.rate
                    ) : (
                      <>
                        <button
                          onClick={() => openContainer(student.id, lesson.id)}
                        >
                          Add Rating
                        </button>
                        {selected &&
                          selected.studentId === student.id &&
                          selected.lessonId === lesson.id && (
                            <div className={style.container}>
                              <p>
                                Rating container for {student.name} -{" "}
                                {lesson.title}
                              </p>
                              <button onClick={closeContainer}>Close</button>
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  if (ratingInput) {
                                    dispatch(
                                      addRating({
                                        lessonId: +lesson?.id,
                                        studentId: +student?.id,
                                        rate: ratingInput,
                                      })
                                    );
                                    closeContainer();
                                  }
                                }}
                                
                              >
                                <input
                                  placeholder="Rate"
                                  type="number"
                                  value={ratingInput}
                                  onChange={(e) =>
                                    setRatingInput(e.target.value)
                                  }
                                  required
                                />
                                <button type="submit">Rate</button>
                              </form>
                            </div>
                          )}
                      </>
                    )}
                  </td>
                );
              })}
              {empty.map((_, index) => (
                <td key={index}></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <AddLesson />
    </>
  );
};
