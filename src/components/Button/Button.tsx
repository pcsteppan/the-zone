import React from "react";
import { CellState, CellValue } from '../../types';
import flagImg from '../../images/flag.png';
import bombImg from '../../images/bomb.gif';
import './Button.scss';

interface ButtonProps {
  row: number;
  col: number;
  value: CellValue;
  state: CellState;
  onClickHandler(rowParam: number, colParam: number) : (...args: any) => void;
  onContextMenuHandler(rowParam: number, colParam: number) : (...args: any) => void;
}

function Button({row, col, value, state, onClickHandler, onContextMenuHandler}: ButtonProps) {
  const renderContent = (): React.ReactNode => {
    switch(state) {
      case CellState.discovered:
        if(value === CellValue.bomb) {
          return <img src={bombImg} alt="nuclear radiation symbol"/>
          // return <span role="img" aria-label="bomb">💣</span>
        } else if (value < CellValue.bomb && value > CellValue.none){
          return <span className={CellValue[value].toString()}>{value}</span>
        }
        break;
      case CellState.flagged:
        return <img src={flagImg} alt="nuclear radiation flag"/>
      case CellState.undiscovered:
        break;
    }
  }

  return (
    <div className={`Button ${value===CellValue.bomb ? "bomb" : ""} ${state===CellState.discovered ? "discovered" : state===CellState.flagged ? "flagged" : "undiscovered"}`}
      onClick={onClickHandler(row, col)}
      onContextMenu={onContextMenuHandler(row, col)}>
      {renderContent()}
    </div>
  )
}

export default Button;