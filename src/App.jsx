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
  localStorage.clear();
  useEffect(() => {
    const localVocabList = localStorage.getItem("localVocabList");
    if (localVocabList) {
      const parsedVocab = JSON.parse(localVocabList);
      setFlashCard(parsedVocab);
    } else {
      localStorage.setItem("localVocabList", JSON.stringify(vocabListFromFile));
      setFlashCard(vocabListFromFile);
    }
    const localRemberList = localStorage.getItem("localRemList");
    if (localRemberList) {
      const parsedRem = JSON.parse(localRemberList);
      setRememberList(parsedRem);
    }
  }, []);

  useEffect(() => {
    if (flashCard.length > 0) {
      localStorage.setItem("localVocabList", JSON.stringify(flashCard));
    }
  }, [flashCard]);

  useEffect(() => {
    if (rememberList.length > 0) {
      localStorage.setItem("localRemList", JSON.stringify(rememberList));
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
    }
  };
  function shuffle() {
    if (normalOrRemember === "normal") {
      for (let i = flashCard.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [flashCard[i], flashCard[j]] = [flashCard[j], flashCard[i]];
      }
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
    normalOrRemember === "normal"
      ? cardID == 0
        ? setCardID(cardID)
        : setCardID(cardID - 1)
      : cardID == 0
      ? setRemCardID(cardID)
      : setRemCardID(cardID - 1);
    setAnswerColor("");
  }
  function forward() {
    normalOrRemember === "remember"
      ? remCardID === rememberList.length - 1
        ? setRemCardID(remCardID)
        : setRemCardID(remCardID + 1)
      : cardID == flashCard.length - 1
      ? setCardID(cardID)
      : setCardID(cardID + 1);
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
          : rememberList[remCardID]?.[frontOrBack]}
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
          {normalOrRemember === "normal" ? "remember" : "forget"}
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
      </div>
    </div>
  );
};
export default App;
