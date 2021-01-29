import { elementRoles } from 'aria-query';
import {MAX_COLS, MAX_ROWS, BOMB_COUNT} from "../constants";
import {CellValue, CellState, Cell} from "../types";

export const generateCells = () : Cell[][] => {
  let cells = new Array(MAX_ROWS).fill(null).map(_ => {
    return new Array(MAX_COLS).fill(null).map((_, i) => {
      return {
        value: CellValue.none,
        state: CellState.undiscovered
      }
    })
  });

  // place 10 bombs randomly
  let bombCount = BOMB_COUNT;
  while(bombCount > 0){
    const rowIndex = Math.floor(Math.random()*MAX_ROWS);
    const colIndex = Math.floor(Math.random()*MAX_COLS);
    if(cells[rowIndex][colIndex].value !== CellValue.bomb){
      cells[rowIndex][colIndex].value = CellValue.bomb;
      bombCount--;
    }
  }

  cells = cells.map((row, rowIndex) => {
    return row.map((cell, colIndex) => {
      let neighborCells = [
        {row: rowIndex-1, col: colIndex-1},
        {row: rowIndex-1, col: colIndex  },
        {row: rowIndex-1, col: colIndex+1},
        {row: rowIndex  , col: colIndex-1},
        {row: rowIndex  , col: colIndex+1},
        {row: rowIndex+1, col: colIndex-1},
        {row: rowIndex+1, col: colIndex  },
        {row: rowIndex+1, col: colIndex+1}
      ];

      const preSumArr : number[] = neighborCells.map((index) => {
        if(index.row < 0 || index.row >= MAX_ROWS || index.col < 0 || index.col >= MAX_COLS){
          return 0;
        } else {
          return cells[index.row][index.col].value === CellValue.bomb ? 1 : 0;
        }
      })

      return cell.value === CellValue.bomb ? cell : {value: preSumArr.reduce( (acc, curr) =>  acc + curr, 0), state: cell.state};
    })
  })

  return cells;
}