import React, { useState } from 'react';
import { GamePhase, GameRecord } from '../../types';
import Game from '../Game/Game';
import './App.scss';

function App() {
  const [showInstructions, setShowInstructions] = useState(false);
  const [gameRecord, setGameRecord] = useState(new Array<GameRecord>());

  const handleXClick = () => {
    setShowInstructions(prev => !prev);
  }

  const handleGameRecordChange = (gameRecord: GameRecord) => {
    setGameRecord(prev => [gameRecord, ...prev]);
  }

  return (
    <div className="App">
      <Game updateGameRecord={handleGameRecordChange} />
      {/* <article className="Panel">
        <div className="InstructionsContainer">
        <h2>Instructions</h2>
        <button className="ShowInstructionsToggle" onClick={handleXClick}>{showInstructions ? "hide" : "show"}</button>
        { showInstructions && 
          <ul className="instructionsList">
            <li>Left-click to reveal tile.</li>
            <li>Right-click to flag tile as radioactive.</li>
            <li>Numbers indicate how many radioactive sites are nearby.</li>
            <li>Reveal all non-radioactive tiles to win.</li>
            <li>After winning or losing, reset with the top button.</li>
          </ul>
        }
        </div>
        <div className="PersonalHighscoreContainer">
          <h2 className="PersonalHighscoresHeader">Personal Highscores</h2>
          <ul className="gameRecord">
            {gameRecord.map(record => {
              return <li>{GamePhase[record.status]} {record.time}</li>
            })}
          </ul>
        </div>
      </article> */}
    </div>
  );
}

export default App;