import { useEffect, useState } from "react";
import "./App.css";
import { GoogleGenerativeAI } from "@google/generative-ai";
import data from "./csvjson.json";
import { TarotCard } from "./components/TarotCard";


function App() {
  const deck = [];

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cardList, setCardList] = useState([]);

  const [interpretationLoading, setInterpretationLoading] = useState(false)
  const [interpretation, setInterpretation] = useState("");
  const [interpretationClicked, setInterpretationClicked] = useState(false)

  const [APIKey, setAPIKey] = useState('')

  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    buildDeck();
    shuffleDeck(deck);
  }, [deck]);

  function buildDeck() {
    let minorTypes = ["S", "C", "P", "W"];
    let minorValues = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
      "13",
      "14",
    ];

    let majorValues = [
      "00",
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
    ];
    // var arr = [];

    for (let i = 0; i < minorTypes.length; i++) {
      for (let j = 0; j < minorValues.length; j++) {
        deck.push(minorTypes[i] + "-" + minorValues[j]);
      }
    }

    for (let i = 0; i < majorValues.length; i++) {
      deck.push("M-" + majorValues[i]);
    }
    // return deck;
  }

  function shuffleDeck(deck) {
    for (let i = 0; i < deck.length; i++) {
      let j = Math.floor(Math.random() * deck.length);
      let temp = deck[i];
      deck[i] = deck[j];
      deck[j] = temp;
      // deck[i], (deck[j] = deck[i]), deck[j];
    }
    return deck;
  }

 
  async function interpretCardHandler(e) {
    e.currentTarget.disabled = true
    
    setInterpretationClicked(true)

    

    // const genAI = new GoogleGenerativeAI(API_KEY);
    const genAI = new GoogleGenerativeAI(APIKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // console.log(cardList);
    let prompt = "Give me a summary of the following Tarot cards:";

    for (let i = 0; i < cardList.length; i++) {
      prompt += ", " + cardList[i];
    }

    console.log(prompt);

    const result = await model.generateContent(prompt);
    // console.log(result.response.text());

    // console.log(result)
    // console.log(result.response.candidates[0].content.parts[0].text)

    let text = result.response.candidates[0].content.parts[0].text.split('**').map((val, idx) => {
      return <p key={idx}>{val}</p>
    })





    setTimeout(() => {
      setInterpretationLoading(true)  
    }, 5000);

    setInterpretation(text);
    
    // console.log(interpretation)
  }

  const drawCardHandler = () => {

    console.log(cards)
    if(!APIKey){
      setErrorMessage('Please enter your API Key')
      return
    } else {
      setErrorMessage('')
    }

    if (cards.length === 3) {
      return;
    }

    let longform;
    let tempCardText;
    let tempCard = deck.pop();
    let tempReversed = Math.round(Math.random());

    for (let i = 0; i < data.length; i++) {
      if (data[i].Shorthand === tempCard) {
        longform = data[i].Longform;
        if (tempReversed) {
          tempCardText = data[i].Reversal;
          longform = longform + " - reversed";
        } else {
          tempCardText = data[i].Upright;
        }

        setLoading(false);
      }
    }

    setCards((cards) => [
      ...cards,
      <TarotCard
        key={tempCard}
        card={tempCard}
        reversed={tempReversed}
        cardText={tempCardText}
      />,
    ]);

    setCardList((cardList) => [...cardList, longform]);

  };

  const buttonDisplay = () => {
    if(cardList.length < 3){
      return <button id="draw" onClick={drawCardHandler}>Draw</button>
    } 
    if (cardList.length > 2 && !interpretationLoading) {
      return <button id="interpret" onClick={(e) => interpretCardHandler(e)}>Interpret</button>
    } else {
      return <button id="redraw" disabled={false} onClick={cleanUp}>Re Draw</button>
    }
  }

  const cleanUp = () => {
    setLoading(true)
    setCards([])
    setCardList([])
    setInterpretation('')
    setInterpretationClicked(false)
    setInterpretationLoading(false)

    drawCardHandler()

  }

  const interpretResults = () => {
    if(cardList.length > 2 && interpretationClicked && !interpretationLoading){
      
      return <p>Loading...</p>
    }

    if(cardList.length > 2 && interpretationClicked && interpretationLoading){
      
      return <div>{interpretation}</div>
    }
  }

  

  return (
    <div className="body">
      <h2>Past, Present Future Spread</h2>
      <label htmlFor="apikey">Gemini API Key</label>
      <input name='apikey' placeholder="Enter your Google Gemini API Key" onChange={(e) => setAPIKey(e.target.value)}/>
      <p id='errorMessage'>{errorMessage}</p>
      <h6><a href="https://ai.google.dev/gemini-api/docs/api-key" target="_blank">Get your API Key Here</a></h6>
      <div id="tarot-cards">
        {loading ? (
          <TarotCard key={'temp'} card={"back"} reversed={0} cardText={""} />
        ) : (
          cards
        )}
      </div>

        <div id="results">
        {interpretResults()}
        </div>
      
      <div id="buttons" className="buttons">
        {buttonDisplay()}
      </div>
    </div>
  );
}

export default App;
