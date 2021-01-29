import React from 'react';

import "./NumberDisplay.scss";

interface NumberDisplayProps {
  displayNumber: number;
}

function NumberDisplay({displayNumber}: NumberDisplayProps) {
  const displayString = displayNumber.toString().padStart(3, "0");
  return <div className="NumberDisplay">{displayString}</div>
}

export default NumberDisplay;