import React, {useEffect, useState} from 'react';
import {Cell, CellValue, CellState} from "../../types"

import Button from '../Button/Button';
import NumberDisplay from '../NumberDisplay/NumberDisplay';
import { generateCells } from '../../utils';
import {Face} from '../../types'

import './App.scss';
import { BOMB_COUNT } from '../../constants';

function App() {
  const [cells, setCells] = useState<Cell[][]>(generateCells());
  const [face , setFace ] = useState<Face>    (Face.glad);
  const [time , setTime ] = useState<number>  (0);
  const [bombCount, setBombCount] = useState<number> (BOMB_COUNT);
  const [live , setLive ] = useState<boolean> (false);

  useEffect(() => {
    const handleMousedown = () => {
      setFace(Face.hesitant);
    }

    const handleMouseup = () => {
      setFace(Face.glad);
    }

    window.addEventListener("mousedown", handleMousedown);
    window.addEventListener("mouseup", handleMouseup);
  }, [])

  useEffect(() => {
    if (live) {
      const interval = setInterval(() => {
        setTime(Math.min(time + 1, 999));
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setTime(0);
    }
  }, [live, time])

  const setCellInCells = (rowParam: number, colParam: number, newCell: Cell) => {
    setCells((cells) => {
      return cells.map((row, rowIndex) => {
        return row.map((currCell, colIndex) => {
          return (rowParam === rowIndex && colParam === colIndex) ? newCell : currCell;
        })
      })
    })
  }

  const handleCellClick = (rowParam: number, colParam: number) => (): void => {
    if(!live) {
      setCells(generateCells([rowParam, colParam]));
      setLive(true);
    }

    setCells((cells) => {
      return cells.map((row, rowIndex) => {
        return row.map((cell, colIndex) => {
          return (rowParam === rowIndex && colParam === colIndex) ? {...cell, state: CellState.discovered} : cell;
        })
      })
    })
  }

  const handleCellContext = (rowParam: number, colParam: number) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    e.preventDefault();
    if(!live) return;
    const currentCell = cells[rowParam][colParam];

    let bombCountChange = -1;

    switch(currentCell.state){
      case CellState.discovered:
        return;
      case CellState.undiscovered:
        setCellInCells(rowParam, colParam, {...cells[rowParam][colParam], state: CellState.flagged});
        break;
      case CellState.flagged:
        setCellInCells(rowParam, colParam, {...cells[rowParam][colParam], state: CellState.undiscovered});
        bombCountChange = 1;
        break;
    }
    setBombCount((bombCount) => bombCount+bombCountChange);
    return;
  }

  const handleFaceClick = () : void => {
    if(!live) {
      setLive(true);
      setTime(0);
      setCells(generateCells());
    }

    // setFace((face) => {
    //   switch(face){
    //     case(Face.glad):
    //       return Face.glad;
    //     case(Face.lost):
    //       return Face.glad;
    //     case(Face.won):
    //       return Face.glad;
    //     default:
    //       return Face.glad;
    //   }
    // })
  }

  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIndex) => {
      return row.map((cell, colIndex) => {
        return <Button
          key={`${rowIndex}-${colIndex}`}
          value={cell.value}
          state ={cell.state}
          row={rowIndex}
          col={colIndex}
          onClickHandler={handleCellClick}
          onContextMenuHandler={handleCellContext}
        />
      })
    })
  }

  return (
    <div className="App">
      <header className="Header">
        <NumberDisplay displayNumber={bombCount} />
        <button className="Face" onClick={handleFaceClick}><span role="img" aria-label="face">{face}</span></button>
        <NumberDisplay displayNumber={time} />
      </header>
      <section className="Body">
        {renderCells()}
      </section>
    </div>
  );
}

export default App;
