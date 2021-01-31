import React, {useEffect, useState, useReducer} from 'react';
import {Cell, CellValue, CellState, Index2D, Action, ActionType} from "../../types"

import Button from '../Button/Button';
import NumberDisplay from '../NumberDisplay/NumberDisplay';
import { generateCells, generateNeighborIndices, bfsDiscover } from '../../utils';
import {Face} from '../../types'

import './App.scss';
import { BOMB_COUNT, MAX_COLS } from '../../constants';

function reducer(state: Cell[][], action: Action): Cell[][] {
  const newState = action.type === ActionType.DISCOVER ? CellState.discovered :
                   action.type === ActionType.FLAG ? CellState.flagged :
                   action.type === ActionType.UNFLAG ? CellState.undiscovered : CellState.undiscovered;

  switch(action.type){
    case ActionType.INIT:
      return generateCells();
    case ActionType.FIRST_CLICK:
      console.log("first click")
      return generateCells(action.i2D);
    case ActionType.BFS_REVEAL:
      console.log("bfs")
      return bfsDiscover(state, action.i2D);
    case ActionType.DISCOVER:
    case ActionType.FLAG:
    case ActionType.UNFLAG:
      console.log("discover/f/u");
      return state.map((row, rowIndex) => {
        return row.map((currCell, colIndex) => {
          return (action.i2D[0] === rowIndex && action.i2D[1] === colIndex) ? {...currCell, state: newState} : currCell;
        })
      })
  }
}

function App() {
  const [cells, cellDispatch] = useReducer(reducer, generateCells());
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

  const lose = () => {
    setLive(false);
    setFace(Face.lost);
    return;
  }

  const handleCellClick = (rowParam: number, colParam: number) => (): void => {
    if(!live) {
      cellDispatch({type: ActionType.FIRST_CLICK, i2D: [rowParam, colParam]});
      setLive(true);
    } else {

    const cell = cells[rowParam][colParam];

    switch(cell.state){
      case CellState.flagged:
        return;
      case CellState.discovered:
        return;
      case CellState.undiscovered:
        if(cell.value === CellValue.none)
          cellDispatch({type: ActionType.BFS_REVEAL, i2D: [rowParam, colParam]})
        else {
          cellDispatch({type: ActionType.DISCOVER, i2D: [rowParam, colParam]})
          if (cell.value === CellValue.bomb)
            lose();
        }
        return;
      }
    }
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
        cellDispatch({type: ActionType.FLAG, i2D: [rowParam, colParam]})
        break;
      case CellState.flagged:
        cellDispatch({type: ActionType.UNFLAG, i2D: [rowParam, colParam]})
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
      cellDispatch({type: ActionType.INIT});
    }
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
