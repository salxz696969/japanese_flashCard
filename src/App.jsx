import { useEffect, useState } from "react";
import vocabListFromFile from "./vocab.json";

const App = () => {
  const [cardID, setCardID] = useState(0);
  const [remCardID, setRemCardID] = useState(0);
  const [frontOrBack, setFrontOrBack] = useState("front");
  const [rememberList, setRememberList] = useState([]);
  const [flashCard, setFlashCard] = useState([]);
  const [normalOrRemember, setNormalOrRemember] = useState("normal");
  const [answer, setAnswer] = useState("");
  const [answerColor, setAnswerColor] = useState("");
  const [lessonVocab, setLessonVocab]= useState("lesson_10");
  // localStorage.clear();
  useEffect(() => {
    const localVocabList = localStorage.getItem("localVocabList");
    if (localVocabList) {
      const parsedVocab = JSON.parse(localVocabList);
      setFlashCard(parsedVocab);
    } else {
      localStorage.setItem("localVocabList", JSON.stringify(vocabListFromFile));
      setFlashCard([...vocabListFromFile["lesson_10"]]);
    }
    const localRemberList = localStorage.getItem("localRemList");
    if (localRemberList) {
      const parsedRem = JSON.parse(localRemberList);
      setRememberList(parsedRem);
    }
  }, []);

  useEffect(() => {
    if (vocabListFromFile[lessonVocab]) {
      setFlashCard([...vocabListFromFile[lessonVocab]]);
      setCardID(0);
    }
  }, [lessonVocab]);

  useEffect(() => {
    if (flashCard.length > 0) {
      localStorage.setItem("localVocabList", JSON.stringify(flashCard));
      console.log(JSON.parse(localStorage.getItem("localVocabList")));
      console.log(JSON.parse(localStorage.getItem("localRemList")));
    }
  }, [flashCard]);

  useEffect(() => {
    if (rememberList.length > 0) {
      localStorage.setItem("localRemList", JSON.stringify(rememberList));
      console.log(JSON.parse(localStorage.getItem("localVocabList")));
      console.log(JSON.parse(localStorage.getItem("localRemList")));
    }
  }, [rememberList]);

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
  };
  return (
    <div
      style={{
        backgroundColor: "skyblue",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100wh",
        height: "896px",
      }}
    >
      <button
        style={{
          height: "200px",
          width: "374px",
          fontSize: "2rem",
          backgroundColor: `${answerColor}`,
        }}
        onClick={updateFrontAndBack}
      >
        {normalOrRemember == "normal"
          ? flashCard.length === 0
            ? "ありがとう！何か練習したいことがあれば聞いてね！💪✨"
            : flashCard[cardID]?.[frontOrBack]
          : rememberList.length === 0
          ? "ありがとう！何か練習したいことがあれば聞いてね！💪✨"
          : rememberList[remCardID][frontOrBack]}
      </button>
      <input
        id="inputBtn"
        type="text"
        style={{ width: "365px", margin: "2px", fontSize: "16px" }}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyDown={(e) => handleClick(e)}
      />
      <br />
      <select name="" id="" value={lessonVocab} onChange={(e)=>setLessonVocab(e.target.value)}>
        <option value="lesson_10">lesson 10</option>
        <option value="lesson_9">lesson 9</option>
      </select>
      <br />
      <div style={{ marginTop: "10px" }}>
        <button
          style={{ height: "50px", width: "185px", margin: "2px" }}
          onClick={() => backWard()}
        >
          {"<"}
        </button>
        <button
          onClick={() => forward()}
          style={{ height: "50px", width: "185px", margin: "2px" }}
        >
          {">"}
        </button>
        <br />
        <button
          onClick={() => moveToRememberList()}
          style={{ height: "50px", width: "185px", margin: "2px" }}
        >
          {normalOrRemember === "normal" ? "Remember" : "Study again"}
        </button>
        <button
          onClick={() => changeNormalOrRemember()}
          style={{ height: "50px", width: "185px", margin: "2px" }}
        >
          Show {normalOrRemember === "normal" ? "remember" : "normal"}
        </button>
        <button
          onClick={() => shuffle()}
          style={{ height: "50px", width: "185px", margin: "2px" }}
        >
          Shuffle
        </button>
        <button
          style={{ height: "50px", width: "185px", margin: "2px" }}
          onClick={() => localStorage.clear()}
        >
          Clear memory
        </button>
      </div>
    </div>
  );
};
export default App;
