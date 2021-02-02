import React, {useEffect, useState, useReducer} from 'react';
import {Cell, CellValue, CellState, Action, ActionType, GamePhase, GameRecord} from "../../types"

import Button from '../Button/Button';
import NumberDisplay from '../NumberDisplay/NumberDisplay';
import { generateCells, bfsDiscover, getGamePhaseFromCells } from '../../utils';

import './Game.scss';
import { BOMB_COUNT } from '../../constants';

function reducer(state: {cells: Cell[][], gamePhase: GamePhase}, action: Action): {cells: Cell[][], gamePhase: GamePhase} {
  const newCellState = action.type === ActionType.DISCOVER ? CellState.discovered :
                   action.type === ActionType.FLAG ? CellState.flagged :
                   action.type === ActionType.UNFLAG ? CellState.undiscovered : CellState.undiscovered;

  let newState = {
    cells: state.cells,
    gamePhase: state.gamePhase
  };

  switch(action.type){
    case ActionType.STATUS_CLICK:
      return {
        cells: (state.gamePhase === GamePhase.playing) ? state.cells : generateCells(),
        gamePhase: (state.gamePhase === GamePhase.won || state.gamePhase === GamePhase.lost) ? GamePhase.apriori : GamePhase.playing
      }
    case ActionType.INIT:
      return {
        cells: generateCells(),
        gamePhase: GamePhase.apriori
      };
    case ActionType.FIRST_CLICK:
      newState.cells = generateCells(action.i2D);
      break;
    case ActionType.BFS_REVEAL:
      newState.cells = bfsDiscover(state.cells, action.i2D);
      break;
    case ActionType.DISCOVER:
    case ActionType.FLAG:
    case ActionType.UNFLAG:
      newState.cells = state.cells.map((row, rowIndex) => {
        return row.map((currCell, colIndex) => {
          return (action.i2D[0] === rowIndex && action.i2D[1] === colIndex) ? {...currCell, state: newCellState} : currCell;
        })
      })
      break;
  }

  newState.gamePhase = getGamePhaseFromCells(newState.cells);

  return newState;
}

interface GameProps {
  updateGameRecord: (gameRecord: GameRecord) => void;
}

function Game({updateGameRecord}: GameProps) {
  const [state, cellDispatch] = useReducer(reducer, {cells: generateCells(), gamePhase: GamePhase.apriori});
  const [time , setTime ] = useState<number>  (0);

  useEffect(() => {
    if (state.gamePhase === GamePhase.playing) {
      const interval = setInterval(() => {
        setTime(Math.min(time + 1, 999));
      }, 1000);
      return () => clearInterval(interval);
    } else if (state.gamePhase === GamePhase.apriori) {
      setTime(0);
    }
  }, [state.gamePhase, time])

  useEffect(() => {
    if(state.gamePhase === GamePhase.won || state.gamePhase === GamePhase.lost){
      updateGameRecord({status: state.gamePhase, time});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.gamePhase])

  const handleCellClick = (rowParam: number, colParam: number) => (): void => {
    if(state.gamePhase !== GamePhase.playing) {
      cellDispatch({type: ActionType.FIRST_CLICK, i2D: [rowParam, colParam]});
    } else {
      const cell = state.cells[rowParam][colParam];

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
          }
          return;
      }
    }
  }

  const handleCellContext = (rowParam: number, colParam: number) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    e.preventDefault();
    if(state.gamePhase !== GamePhase.playing) return;
    const currentCell = state.cells[rowParam][colParam];

    switch(currentCell.state){
      case CellState.discovered:
        return;
      case CellState.undiscovered:
        cellDispatch({type: ActionType.FLAG, i2D: [rowParam, colParam]})
        break;
      case CellState.flagged:
        cellDispatch({type: ActionType.UNFLAG, i2D: [rowParam, colParam]})
        break;
    }
    return;
  }

  const handleStatusClick = () : void => {
    cellDispatch({type: ActionType.STATUS_CLICK});
  }

  const bombCount = () => {
    return BOMB_COUNT - state.cells.reduce((acc, curr) => {
      return acc + curr.reduce((acc, curr) => {
        return acc + ((curr.state === CellState.flagged) ? 1 : 0);
      }, 0)
    }, 0)
  }

  const renderCells = (): React.ReactNode => {
    return state.cells.map((row, rowIndex) => {
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
    <div className="Game">
      <header className="Header">
        <NumberDisplay displayNumber={bombCount()} />
        <button className={`GamePhaseButton ${GamePhase[state.gamePhase]}`}
          onClick={handleStatusClick}></button>
        <NumberDisplay displayNumber={time} />
      </header>
      <section className="Body">
        {renderCells()}
      </section>
    </div>
  );
}

export default Game;
