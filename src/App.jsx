import { useState } from "react";
const data = [
  { front: "ハンサム", back: "handsome" },
  { front: "きれい", back: "beautiful, clean" },
  { front: "しずか", back: "quiet" },
  { front: "にぎやか", back: "lively" },
  { front: "ゆうめい", back: "famous" },
  { front: "しんせつ", back: "kind" },
  { front: "げんき", back: "healthy, sound, cheerful" },
  { front: "ひま", back: "free (time)" },
  { front: "べんり", back: "convenient" },
  { front: "すてき", back: "fine, nice, wonderful" },
  { front: "おおきい", back: "big, large" },
  { front: "ちいさい", back: "small, little" },
  { front: "あたらしい", back: "new" },
  { front: "ふるい", back: "old (not of age)" },
  { front: "いい (よい)", back: "good" },
  { front: "わるい", back: "bad" },
  { front: "あつい", back: "hot" },
  { front: "さむい", back: "cold (temperature)" },
  { front: "つめたい", back: "cold (to the touch)" },
  { front: "むずかしい", back: "difficult" },
  { front: "やさしい", back: "easy" },
  { front: "たかい", back: "expensive, tall, high" },
  { front: "やすい", back: "inexpensive" },
  { front: "ひくい", back: "low" },
  { front: "おもしろい", back: "interesting" },
  { front: "おいしい", back: "delicious, tasty" },
  { front: "いそがしい", back: "busy" },
  { front: "たのしい", back: "enjoyable" },
  { front: "しろい", back: "white" },
  { front: "くろい", back: "black" },
  { front: "あかい", back: "red" },
  { front: "あおい", back: "blue" },
  { front: "さくら", back: "cherry blossom" },
  { front: "やま", back: "mountain" },
  { front: "まち", back: "town, city" },
  { front: "たべもの", back: "food" },
  { front: "くるま", back: "car, vehicle" },
  { front: "ところ", back: "place" },
  { front: "りょう", back: "dormitory" },
  { front: "べんきょう", back: "study" },
  { front: "せいかつ", back: "life" },
  { front: "しごと", back: "work, business" },
  { front: "どう", back: "how" },
  { front: "どんな", back: "what kind of" },
  { front: "どれ", back: "which one (of three or more)" },
  { front: "とても", back: "very" },
  { front: "あまり", back: "not so (used with negatives)" },
  { front: "そして", back: "and (used to connect sentences)" },
  { front: "〜が、〜", back: "~, but ~" },
  { front: "おげんきですか", back: "How are you?" },
  { front: "そうですね", back: "Well, let me see. (pausing)" },
  {
    front: "にほんのせいかつになれましたか",
    back: "Have you got used to life in Japan?",
  },
  {
    front: "もういっぱいいかがですか",
    back: "Won't you have another cup of ~?",
  },
  { front: "いいえ、けっこうです", back: "No, thank you." },
  { front: "もう〜ですね", back: "It's already ~, isn't it?" },
  { front: "そろそろしつれいします", back: "It's almost time to leave now." },
];
const App = () => {
  const [cardID, setCardID] = useState(0);
  const [remCardID, setRemCardID] = useState(0);
  const [frontOrBack, setFrontOrBack] = useState("front");
  const [flashCard, setFlashCard] = useState(data);
  const [rememberList, setRememberList] = useState([]);
  const [normalOrRemember, setNormalOrRemember] = useState("normal");
  const [answer, setAnswer] = useState("");
  const [answerColor, setAnswerColor] = useState("");
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
      setFlashCard([{ front: "", back: "" }]);
      setFlashCard([
        {
          front: "ありがとう！何か練習したいことがあれば聞いてね！💪✨",
          back: "Congrats, you have learnt every word!💪✨",
        },
      ]);
      return;
    }
    if (cardID === flashCard.length - 1) {
      setCardID(cardID - 1);
      setFlashCard(flashCard.filter((_, index) => index !== cardID));
      setRememberList([...rememberList, cardToMove]);
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
    } else {
      for (let i = remCardID.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [remCardID[i], remCardID[j]] = [remCardID[j], remCardID[i]];
      }
    }
  }
  function checkAnswer() {
    if (answer === flashCard[cardID]["front"]) {
      setAnswerColor("green");
      setAnswer("");
      setTimeout(() => {
        setAnswerColor("");
        moveToRememberList();
      }, 500);
    } else {
      setAnswerColor("red");
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
  }
  const handleClick = (e) => {
    if (e.key === "Enter" && normalOrRemember === "normal") {
      document.getElementById("submitBtn").click();
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
      }}
    >
      <button
        style={{
          height: "500px",
          width: "374px",
          fontSize: "4rem",
          backgroundColor: `${answerColor}`,
        }}
        onClick={updateFrontAndBack}
      >
        {normalOrRemember == "normal"
          ? flashCard[cardID][frontOrBack]
          : rememberList[remCardID][frontOrBack]}
      </button>
      <div>
        <input
          id="inputBtn"
          type="text"
          style={{ width: "200px", margin: "2px" }}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={handleClick}
        />
        <button
          id="submitBtn"
          style={{ width: "110px", margin: "2px" }}
          onClick={() => checkAnswer()}
        >
          Submit
        </button>
      </div>
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
          style={{ height: "50px", width: "122px", margin: "2px" }}
        >
          Remember
        </button>
        <button
          onClick={() => changeNormalOrRemember()}
          style={{ height: "50px", width: "122px", margin: "2px" }}
        >
          Show {normalOrRemember === "normal" ? "remember" : "normal"}
        </button>
        <button
          onClick={() => shuffle()}
          style={{ height: "50px", width: "122px", margin: "2px" }}
        >
          Shuffle
        </button>
      </div>
    </div>
  );
};
export default App;
