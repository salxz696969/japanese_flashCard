import {useEffect, useState } from "react";
import vocabListFromFile from "./vocab.json"
import grammarListFromFile from "./grammar.json"



const App = () => {
  const [cardID, setCardID] = useState(0);
  const [remCardID, setRemCardID] = useState(0);
  const [frontOrBack, setFrontOrBack] = useState("front");
  const [grammarOrVocab, setGrammarOrVocab] = useState("Vocabulary");
  const [rememberList, setRememberList] = useState([]);
  const [vocabList, setVocabList]=useState([]);
  const [grammarList, setGrammarList]=useState([]);
  const [flashCard, setFlashCard] = useState(vocabList);
  const [normalOrRemember, setNormalOrRemember] = useState("normal");
  const [answer, setAnswer] = useState("");
  const [answerColor, setAnswerColor] = useState("");

  useEffect(() => {
    const localVocabList = localStorage.getItem("localVocabList");
    if (localVocabList) {
      setVocabList(JSON.parse(localVocabList));
      setFlashCard(JSON.parse(localVocabList))
    } else {
      localStorage.setItem("localVocabList", JSON.stringify(vocabListFromFile));
      setVocabList(vocabListFromFile);
      setFlashCard(vocabListFromFile)
    }

    const localGrammarList = localStorage.getItem("localGrammarList");
    if (localGrammarList) {
      setGrammarList(JSON.parse(localGrammarList));
    } else {
      localStorage.setItem("localGrammarList", JSON.stringify(grammarListFromFile));
      setGrammarList(grammarListFromFile);
    }
  }, []);

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
      localStorage.setItem("localVocabList", JSON.stringify(flashCard))
      setRememberList([...rememberList, cardToMove]);
      if(flashCard===vocabList){
        setVocabList(flashCard.filter((_, index) => index !== cardID))
      }
      return;
    }
    setFlashCard(flashCard.filter((_, index) => index !== cardID));
    localStorage.setItem("localVocabList", JSON.stringify(flashCard))
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
          <button onClick={()=>console.log(localStorage.getItem("localVocabList"))}></button>
      </div>
    </div>
  );
};
export default App;
// lesson 9 [
//   { "back": "すき", "front": "like" },
//   { "back": "ハンサム", "front": "handsome" },
//   { "back": "きらい", "front": "dislike" },
//   { "back": "わかります", "front": "understand" },
//   { "back": "じょうず", "front": "good at" },
//   { "back": "へた", "front": "bad at" },
//   { "back": "りょり", "front": "cooking, cuisine" },
//   { "back": "のみもの", "front": "drinks" },
//   { "back": "たべもの", "front": "foods" },
//   { "back": "おんがく", "front": "music" },
//   { "back": "うた", "front": "song" },
//   { "back": "え", "front": "picture" },
//   { "back": "もしもし", "front": "hello(using on phone)" },
//   { "back": "どうして", "front": "why, what is the reason" },
//   { "back": "どう", "front": "how" },
//   { "back": "ぜんぜん", "front": "not at all" },
//   { "back": "すこし", "front": "little bit" },
//   { "back": "たくさん", "front": "many, a lot" },
//   { "back": "だいたい", "front": "almost, general, substantially, about much" },
//   { "back": "くども", "front": "children" },
//   { "back": "おくさん", "front": "your wife, his wife, wife" },
//   { "back": "うま/かない", "front": "(my) wife" },
//   { "back": "おっゅじん", "front": "(my) husband" },
//   { "back": "ごしゅじん", "front": "(your) husband" },
//   { "back": "やくそく", "front": "promise, agreement" },
//   { "back": "ようじ", "front": "tasks, things to do" },
//   { "back": "よく", "front": "often, well" },
//   { "back": "どんな", "front": "which one" },
//   { "back": "から", "front": "because, from" },
//   { "back": "はやく", "front": "fast, early, quickly" },
//   { "back": "きれい", "front": "beautiful, clean" },
//   { "back": "しずか", "front": "quiet" },
//   { "back": "にぎやか", "front": "lively" },
//   { "back": "ゆうめい", "front": "famous" },
//   { "back": "しんせつ", "front": "kind" },
//   { "back": "げんき", "front": "healthy, sound, cheerful" },
//   { "back": "ひま", "front": "free (time)" },
//   { "back": "べんり", "front": "convenient" },
//   { "back": "すてき", "front": "fine, nice, wonderful" },
//   { "back": "おおきい", "front": "big, large" },
//   { "back": "ちいさい", "front": "small, little" },
//   { "back": "あたらしい", "front": "new" },
//   { "back": "あります", "front": "have" },
//   { "back": "やきゅう", "front": "baseball" },
//   { "back": "りょこう", "front": "trip" },
//   { "back": "じ", "front": "character(language)" },
//   { "back": "じかん", "front": "time,  hour" },
//   { "back": "ふるい", "front": "old (not of age)" },
//   { "back": "いい (よい)", "front": "good" },
//   { "back": "わるい", "front": "bad" },
//   { "back": "あつい", "front": "hot" },
//   { "back": "さむい", "front": "cold (temperature)" },
//   { "back": "つめたい", "front": "cold (to the touch)" },
//   { "back": "むずかしい", "front": "difficult" },
//   { "back": "やさしい", "front": "easy" },
//   { "back": "たかい", "front": "expensive, tall, high" },
//   { "back": "やすい", "front": "inexpensive" },
//   { "back": "ひくい", "front": "low" },
//   { "back": "おもしろい", "front": "interesting" },
//   { "back": "おいしい", "front": "delicious, tasty" },
//   { "back": "いそがしい", "front": "busy" },
//   { "back": "たのしい", "front": "enjoyable" },
//   { "back": "しろい", "front": "white" },
//   { "back": "くろい", "front": "black" },
//   { "back": "あかい", "front": "red" },
//   { "back": "あおい", "front": "blue" },
//   { "back": "さくら", "front": "cherry blossom" },
//   { "back": "やま", "front": "mountain" },
//   { "back": "まち", "front": "town, city" },
//   { "back": "くるま", "front": "car, vehicle" },
//   { "back": "ところ", "front": "place" },
//   { "back": "りょう", "front": "dormitory" },
//   { "back": "べんきょう", "front": "study" },
//   { "back": "せいかつ", "front": "life" },
//   { "back": "しごと", "front": "work, business" },
//   { "back": "どう", "front": "how" },
//   { "back": "どんな", "front": "what kind of" },
//   { "back": "どれ", "front": "which one (of three or more)" },
//   { "back": "とても", "front": "very" },
//   { "back": "あまり", "front": "not so (used with negatives)" },
//   { "back": "そして", "front": "and (used to connect sentences)" },
//   { "back": "が", "front": "~, but ~" }
// ]
