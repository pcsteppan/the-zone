import React from 'react';

import "./NumberDisplay.scss";

interface NumberDisplayProps {
  displayNumber: number;
}

function NumberDisplay({displayNumber}: NumberDisplayProps) {
  let displayString = displayNumber.toString().padStart(3, "0");
  if(displayNumber < 0){
    displayString = "-" + (displayNumber*-1).toString().padStart(2, "0");
  }
  return <div className="NumberDisplay">{displayString}</div>
}

export default NumberDisplay;