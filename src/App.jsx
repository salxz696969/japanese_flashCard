import {useState } from "react";
import vocabListFromFile from "./vocab.json"
import grammarListFromFile from "./grammar.json"



const App = () => {
  const [cardID, setCardID] = useState(0);
  const [remCardID, setRemCardID] = useState(0);
  const [frontOrBack, setFrontOrBack] = useState("front");
  const [grammarOrVocab, setGrammarOrVocab] = useState("Vocabulary");
  const [flashCard, setFlashCard] = useState(vocabListFromFile);
  const [rememberList, setRememberList] = useState([]);
  const vocabList=vocabListFromFile;
  const grammarList=grammarListFromFile;
  const [normalOrRemember, setNormalOrRemember] = useState("normal");
  const [answer, setAnswer] = useState("");
  const [answerColor, setAnswerColor] = useState("");
  
  // useEffect(()=>{
  //   const fetchVocab=async()=>{
  //     try {
  //       const response=await fetch("/src/vocab.json");
  //       const fetchedVocab=await response.json();
  //       setVocablist(fetchedVocab);
  //       setFlashCard(fetchedVocab)
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }
  //   fetchVocab();
  // }, [])
  // useEffect(()=>{
  //   const fetchGrammar=async()=>{
  //     try {
  //       const response=await fetch("/src/grammar.json");
  //       const fetchedGrammar=await response.json();
  //       setGrammarList(fetchedGrammar);
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }
  //   fetchGrammar();
  // }, [])


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
    if (normalOrRemember === "remember") {
      return;
    }
    let cardToMove = flashCard[cardID];
    if (flashCard.length === 1) {
      setFlashCard([
        {
          back: "ありがとう！何か練習したいことがあれば聞いてね！💪✨",
          front: "Congrats, you have learnt every word!💪✨",
        },
      ]);
      return;
    }
    if (cardID === flashCard.length - 1) {
      setCardID(cardID - 1);
      setFlashCard(flashCard.filter((_, index) => index !== cardID));
      setRememberList([...rememberList, cardToMove]);
      return;
    }
    setFlashCard(flashCard.filter((_, index) => index !== cardID));
    setRememberList([...rememberList, cardToMove]);
  };
  function shuffle() {
    if (normalOrRemember === "normal") {
      for (let i = flashCard.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [flashCard[i], flashCard[j]] = [flashCard[j], flashCard[i]];
      }
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
  function handleGrammarOrVocab() {
    if (grammarOrVocab === "Vocabulary") {
      setFlashCard(grammarList);
      setGrammarOrVocab("Grammar");
    } else {
      setFlashCard(vocabList);
      setGrammarOrVocab("Vocabulary");
    }
  }
  return (
    <div
      style={{
        backgroundColor: "skyblue",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width:"100wh",
        height:"896px"
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
          ? flashCard[cardID]?.[frontOrBack]
          : rememberList[remCardID]?.[frontOrBack]}
      </button>
      <input
        id="inputBtn"
        type="text"
        style={{ width: "365px", margin: "2px", fontSize: "16px" }}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyDown={(e)=>handleClick(e)}
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
          Remember
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
          onClick={() => handleGrammarOrVocab()}
          style={{ height: "50px", width: "185px", margin: "2px" }}
        >
          {grammarOrVocab === "Grammar" ? "Vocabulary mode" : "Grammar Mode"}
        </button>
      </div>
    </div>
  );
};
export default App;
