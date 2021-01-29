import React from "react";
import { CellState, CellValue } from '../../types';
import './Button.scss';

interface ButtonProps {
  row: number;
  col: number;
  value: CellValue;
  state: CellState;
}

function Button({row, col, value, state}: ButtonProps) {
  const renderContent = (): React.ReactNode => {
    switch(state) {
      case CellState.discovered:
        if(value === CellValue.bomb) {
          return <span role="img" aria-label="bomb">💣</span>
        } else if (value < CellValue.bomb && value > CellValue.none){
          return <span className={CellValue[value].toString()}>{value}</span>
        }
        break;
      case CellState.flagged:
        return <span role="img" aria-label="flag">🚩</span>
      case CellState.undiscovered:
        break;
    }
  }

  return (
    <div className={`Button ${state===CellState.discovered ? "discovered" : "undiscovered"}`}>
      {renderContent()}
    </div>
  )
}

export default Button;