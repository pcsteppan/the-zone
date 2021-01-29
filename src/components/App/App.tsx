import React, {useState} from 'react';
import {Cell, CellValue, CellState} from "../../types"

import Button from '../Button/Button';
import NumberDisplay from '../NumberDisplay/NumberDisplay';
import { generateCells } from '../../utils';

import './App.scss';

function App() {
  const [cells, setCells] = useState(generateCells());

  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIndex) => {
      return row.map((cell, colIndex) => {
        return <Button key={`${rowIndex}-${colIndex}`} row={rowIndex} col={colIndex} value={cell.value} state ={cell.state}/>
      })
    })
  }

  return (
    <div className="App">
      <header className="Header">
        <NumberDisplay displayNumber={0} />
        <button className="Face"><span role="img" aria-label="face">😁</span></button>
        <NumberDisplay displayNumber={23} />
      </header>
      <section className="Body">
        {renderCells()}
      </section>
    </div>
  );
}

export default App;
