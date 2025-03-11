import { useEffect, useRef, useState } from "react";
import vocabListFromFile from "./vocab.json";
import "./styling.css";
const App = () => {
  const [cardID, setCardID] = useState(0);
  const [remCardID, setRemCardID] = useState(0);
  const [frontOrBack, setFrontOrBack] = useState("front");
  const [rememberList, setRememberList] = useState([]);
  const [flashCard, setFlashCard] = useState([]);
  const [normalOrRemember, setNormalOrRemember] = useState("normal");
  const [answer, setAnswer] = useState("");
  const [answerColor, setAnswerColor] = useState("");
  const [lessonVocab, setLessonVocab] = useState(
    () => localStorage.getItem("lastLesson") || "lesson1"
  );
  const [mode, setMode] = useState(
    () => localStorage.getItem("lastMode") || "quiz"
  );
  const [indCard, setIndCard] = useState(new Array(0).fill("front"));

  const [activeIndex, setActiveIndex] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const holdTimer = useRef(null);

  // Long Press Handler
  const handleMouseDown = (e, index) => {
    holdTimer.current = setTimeout(() => {
      showMenu(e, index);
    }, 200); // 600ms for long press
  };

  const handleMouseUp = () => clearTimeout(holdTimer.current);
  const handleMouseLeave = () => clearTimeout(holdTimer.current);
  
  const handleTouchStart = (e, index) => {
    e.preventDefault(); // Prevent default touch behavior
    holdTimer.current = setTimeout(() => {
      showMenu(e, index); // Show context menu on long press
    }, 200); // Long press duration (600ms)
  };
  
  const handleTouchEnd = () => {
    clearTimeout(holdTimer.current); // Clear the timer when touch ends
  };

  const handleContextMenu = (e, index) => {
    e.preventDefault();
    showMenu(e, index);
  };

  const showMenu = (e, index) => {
    setActiveIndex(index); // Track which button was clicked
    setMenuPosition({ x: e.pageX, y: e.pageY });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey&& e.altKey && e.key === "m") {
        setMode((prevMode) => (prevMode === "quiz" ? "study" : "quiz"));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".context-menu")) {
        setActiveIndex(null);
      }
    };

    if (activeIndex !== null) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [activeIndex]);

  useEffect(() => {
    localStorage.setItem("lastLesson", lessonVocab);
    if (vocabListFromFile[lessonVocab]) {
      setFlashCard([...vocabListFromFile[lessonVocab]]);
      setCardID(0);
    }
  }, [lessonVocab]);

  useEffect(() => {
    localStorage.setItem("lastMode", mode);
  }, [mode]);


  useEffect(() => {
    setIndCard(Array(flashCard.length).fill("front"));
  }, [flashCard]);

  const changeNormalOrRemember = () => {
    if (normalOrRemember === "normal" && rememberList.length > 0) {
      setNormalOrRemember("remember");
    } else {
      setNormalOrRemember("normal");
    }
  };
  const updateFrontAndBack = () => {
    if (frontOrBack === "front") {
      setFrontOrBack("back");
    } else {
      setFrontOrBack("front");
    }
  };
  const moveToRememberList = () => {
    if (normalOrRemember === "normal") {
      if (flashCard.length === 0) return;
      let cardToMove = flashCard[cardID];
      if (flashCard.length === 0) {
        return;
      }
      if (cardID === flashCard.length - 1) {
        setCardID(cardID - 1);
        setFlashCard(flashCard.filter((_, index) => index !== cardID));
        setRememberList([...rememberList, cardToMove]);
      } else {
        setFlashCard(flashCard.filter((_, index) => index !== cardID));
        setRememberList([...rememberList, cardToMove]);
      }
    } else {
      if (rememberList.length > 0) {
        changeNormalOrRemember();
        setFlashCard((prev) => [...prev, ...rememberList]);
        setRememberList([]);
      }
    }
  };
  function shuffle() {
    if (normalOrRemember === "normal") {
      setFlashCard((prevFlashCards) => {
        const shuffled = [...prevFlashCards].sort(() => Math.random() - 0.5);
        return shuffled;
      });
      setCardID(0);
    }
  }

  function checkAnswer() {
    if (frontOrBack === "back") {
      setFrontOrBack("front");
    }
    if (answer === flashCard[cardID]["back"]) {
      setAnswerColor("green");
      setAnswer("");
      setTimeout(() => {
        setAnswerColor("");
        moveToRememberList();
      }, 500);
    }
  }

  function backWard() {
    if (frontOrBack === "back") {
      setFrontOrBack("front");
    }
    if (normalOrRemember === "normal") {
      if (cardID === 0) {
        setCardID(cardID);
      } else {
        setCardID(cardID - 1);
      }
    } else {
      if (remCardID === 0) {
        setRemCardID(remCardID);
      } else {
        setRemCardID(remCardID - 1);
      }
    }
    setAnswerColor("");
  }
  function forward() {
    if (frontOrBack === "back") {
      setFrontOrBack("front");
    }
    if (normalOrRemember === "remember") {
      if (remCardID === rememberList.length - 1) {
        setRemCardID(remCardID);
      } else {
        setRemCardID(remCardID + 1);
      }
    } else {
      if (cardID === flashCard.length - 1) {
        setCardID(cardID);
      } else {
        setCardID(cardID + 1);
      }
    }
    setAnswerColor("");
  }
  const handleClick = (e) => {
    if (e.key === "Enter" && normalOrRemember === "normal") {
      checkAnswer();
    }
    
    if (e.key === "Enter" && normalOrRemember === "normal") {
      checkAnswer();
    } else if (e.key === "ArrowLeft") {
      backWard();
    } else if (e.key === "ArrowRight") {
      forward();
    }
    if (e.ctrlKey && e.altKey && e.key === "s") {
      shuffle();
    }

  };
  const quiz = () => {
    return (
      <div id="quiz">
        <div id="showBlahBlah">
          <button
            id="show1"
            onClick={() => setNormalOrRemember("normal")}
            style={
              normalOrRemember === "normal"
                ? { backgroundColor: "#C6E7FF" }
                : { backgroundColor: "#ffffff" }
            }
          >
            Show normal
          </button>

          <button
            id="show2"
            onClick={() => setNormalOrRemember("remember")}
            style={
              normalOrRemember === "remember" && rememberList.length > 0
                ? { backgroundColor: "#C6E7FF" }
                : { backgroundColor: "#ffffff" }
            }
          >
            Show remember
          </button>
        </div>

        <button
          style={{
            backgroundColor: `${answerColor}`,
          }}
          onClick={updateFrontAndBack}
          id="display"
        >
          {normalOrRemember === "normal"
            ? flashCard.length === 0
              ? "ありがとう！何か練習したいことがあれば聞いてね！💪✨"
              : flashCard[cardID]?.[frontOrBack]
            : rememberList.length === 0
            ? "ありがとう！何か練習したいことがあれば聞いてね！💪✨"
            : rememberList[remCardID][frontOrBack]}
        </button>

        <div id="box">
          <input
            id="inputBtn"
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => handleClick(e)}
            placeholder="Type the correct answer..."
          />
          <br />

          <br />

          <button onClick={() => backWard()} className="navR">
            {"<"}
          </button>
          <button onClick={() => forward()} className="navL">
            {">"}
          </button>

          <br />

          <button
            onClick={() => {
              moveToRememberList();
            }}
            id="rem"
          >
            {normalOrRemember === "normal" ? "Remember" : "Study again"}
          </button>
        </div>
      </div>
    );
  };
  const updateInd = (index) => {
    setIndCard((prev) =>
      prev.map((e, i) => {
        if (i === index) {
          e = e === "front" ? "back" : "front";
        }
        return e;
      })
    );
  };

  const study = () => {
    return flashCard.map((e, index) => {
      return (
        <div key={index} className="relative">
          <button
            onClick={() => updateInd(index)}
            onMouseDown={(event) => handleMouseDown(event, index)}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={(event) => handleTouchStart(event, index)}
            onTouchEnd={handleTouchEnd}
            onContextMenu={(event) => handleContextMenu(event, index)}
            className={`p-3 bg-blue-500 text-white rounded ${activeIndex === index ? "highlighted-button" : ""}`}
          >
            {e[indCard[index]]}
          </button>

          {activeIndex === index && (
            <div
            className="context-menu"
            style={{
              height:"50px",
              width: "150px",
              top: menuPosition.y,
              left: menuPosition.x,
              zIndex: 1000,
              position: "absolute",
            }}
            >
              <button onClick={() => {
                setFlashCard(flashCard.filter((_, i) => i !== index));
              }}>Remember</button>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div id="container">
      <select
        name=""
        id="select"
        value={lessonVocab}
        onChange={(e) => setLessonVocab(e.target.value)}
      >
        <option value="lesson1">Lesson 1</option>
        <option value="lesson2">Lesson 2</option>
        <option value="lesson3">Lesson 3</option>
        <option value="lesson4">Lesson 4</option>
        <option value="lesson5">Lesson 5</option>
        <option value="lesson6">Lesson 6</option>
        <option value="lesson7">Lesson 7</option>
        <option value="lesson8">Lesson 8</option>
        <option value="lesson9">Lesson 9</option>
        <option value="lesson10">Lesson 10</option>
        <option value="lesson11">Lesson 11</option>
        <option value="lesson12">Lesson 12</option>
        <option value="lesson13">Lesson 13</option>
        <option value="lesson14">Lesson 14</option>
        <option value="lesson15">Lesson 15</option>
        <option value="lesson16">Lesson 16</option>
        <option value="lesson17">Lesson 17</option>
        <option value="lesson18">Lesson 18</option>
        <option value="lesson19">Lesson 19</option>
        <option value="lesson20">Lesson 20</option>
        <option value="lesson21">Lesson 21</option>
        <option value="lesson22">Lesson 22</option>
        <option value="lesson23">Lesson 23</option>
        <option value="lesson24">Lesson 24</option>
        <option value="lesson25">Lesson 25</option>
        <option value="counting">Counting</option>
        <option value="date">Date</option>
      </select>
      <div id="show">
        {mode === "quiz" ? quiz() : <div id="study">{study()}</div>}
        <div id="connn">
          <button id="con1" onClick={() => shuffle()}>
            Shuffle
          </button>
          <button
            id="mode"
            onClick={() =>
              mode === "quiz" ? setMode("study") : setMode("quiz")
            }
          >
            {mode === "quiz" ? "Study mode" : "Quiz mode"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default App;
