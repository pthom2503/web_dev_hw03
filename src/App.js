import {useEffect, useState} from 'react';
import 'milligram';

import {check_answer, generate_secret, nonDupe, uniq} from './game';
import './App.css';

// based on lecture code
function SetTitle({text}) {
    useEffect(() => {
        let orig = document.title;
        document.title = text;

        // Cleanup function
        return () => {
            document.title = orig;
        };
    });

    return <div/>;
}


// the structure of this function was pulled from the lecture code - will mark exact functions within
function Controls({guess, reset, disabled, secret}) {
    // WARNING: State in a nested component requires
    // careful thought.
    // If this component is ever unmounted (not shown
    // in a render), the state will be lost.
    // The default choice should be to put all state
    // in your root component.
    const [text, setText] = useState("");

    // based on lecture code
    function updateText(ev) {
        setText(ev.target.value);
    }

    // based initially on lecture code
    function keyPress(ev) {
        // submit guess when the user hits enter
        if (ev.key == "Enter") {
            guess(text);
            setText('')
            // prevent non-digit guesses
        } else if (!((ev.key == "0") ||
            (ev.key == "1") ||
            (ev.key == "2") ||
            (ev.key == "3") ||
            (ev.key == "4") ||
            (ev.key == "5") ||
            (ev.key == "6") ||
            (ev.key == "7") ||
            (ev.key == "8") ||
            (ev.key == "9")
        )) {
            ev.preventDefault();
        }
    }

    function clearReset() {
        setText('');
        reset();
    }

    function clearEnter() {
        guess(text);
        setText('');
    }

    // based on lecture code
    return (
        <div className="row">
            <div className="column">
                <p>
                    <input type="text"
                           maxLength={4}
                           value={text}
                           disabled={disabled}
                           onChange={updateText}
                           onKeyPress={keyPress}/>
                </p>
            </div>
            <div className="column">
                <p>
                    <button disabled={disabled} onClick={clearEnter}>Guess</button>
                </p>
            </div>
            <div className="column">
                <p>
                    <button onClick={clearReset}>
                        Reset Game
                    </button>
                </p>
            </div>
        </div>
    );
}

function PrevGuesses({guesses, results}) {

    // for each available guess out of 8, if the guess has already happened,
    // add the number and guess, otherwise add only the number
    // each used guess also has a corresponding result, so add results as needed
    let guessBodies = [];
    let resultBodies = [];
    for (let i = 0; i < 8; i++) {
        if (i < guesses.length) {
            guessBodies[i] = (i + 1) + ":\t" + guesses[i];
            resultBodies[i] = results[i][0] + " Bulls, " + results[i][1] + " Cows"
        } else {
            guessBodies[i] = (i + 1) + ": ";
            resultBodies[i] = " ";
        }
    }

    // pair guesses and results so the html can be generated in one mapping
    // we are guaranteed the guessBodies and resultBodies arrays are of the same length
    let bodyPairs = [];
    for (let i = 0; i < guessBodies.length; i++) {
        bodyPairs[i] = [guessBodies[i], resultBodies[i]]
    }


    return (
        <div className="row">
            <div className="column">
                {bodyPairs.map(item => (
                    <div key={item} className="row">
                        <div className="column">
                            <p>{item[0]}</p>
                        </div>
                        <div className="column">
                            <p>{item[1]}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="column">
            </div>
        </div>
    )
}

// the structure of this function was pulled from the lecture code - will mark exact functions within
function App() {
    // portions of state based off lecture code

    const [secret, _setSecret] = useState(generate_secret());
    const [guesses, setGuesses] = useState([]);
    const [results, setResults] = useState([]);
    const [warnings, setWarnings] = useState("Welcome. Please enter 4 digits to begin");
    const [disabled, setDisabled] = useState(false);


    // vaguely based off lecture code
    function guess(text) {
        // add message if user attempts to enter too few digits
        if (text.length != 4) {
            setWarnings("Must input 4 digits");
        } else {
            if (nonDupe(text)) {
                // if the guess has not been previously guessed
                if (uniq(guesses, text)) {
                    let result = check_answer(secret, text);
                    // copy both state arrays so that the react app knows to rerender
                    // just changing the array elements doesn't trigger the state change marker for rerendering
                    let resultsCopy = [...results];
                    resultsCopy.push(result);
                    setResults(resultsCopy);
                    let attempts = [...guesses];
                    attempts.push(text);
                    setGuesses(attempts);
                    // immediately display wins or losses instead of having to move this out to
                    // allow the state to update to use the state vars themselves
                    if (resultsCopy.length > 0 && resultsCopy[resultsCopy.length - 1][0] === 4) {
                        setWarnings("Congratulations! You win!");
                        setDisabled(true);
                    } else if (attempts.length === 8) {
                        setWarnings("Ran out of guesses. You lose. Secret code was: " + secret);
                        setDisabled(true);
                    } else {
                        // a successful entry resets any warning messages
                        setWarnings("");
                    }
                } else {
                    setWarnings("Repeated guess: " + text)
                }
            } else {
                setWarnings("All digits must be unique: " + text)
            }
        }
    }

    // based off lecture code
    function reset() {
        setGuesses([]);
        setResults([]);
        setDisabled(false);
        setWarnings("Please enter 4 digits to begin");
        _setSecret(generate_secret());
    }

    // based off lecture code
    let body = (
        <div>
            <SetTitle text={"4Digits Game"}/>
            <div className="row">
                <div className="column">
                    <h1>4Digits!</h1>
                    <Controls reset={reset} guess={guess} disabled={disabled} secret={secret}/>
                </div>
                <div className="column">
                    <p>{"\n"}</p>
                    <p className="userMessages">{warnings}</p>
                </div>
            </div>
            <PrevGuesses guesses={guesses} results={results}/>
        </div>
    );
    return (
        <div className="container">
            {body}
        </div>
    );
}

export default App;
