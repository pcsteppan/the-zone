import { elementRoles } from 'aria-query';
import {MAX_COLS, MAX_ROWS, BOMB_COUNT} from "../constants";
import {CellValue, CellState, Cell, Index2D} from "../types";

export const generateNeighborIndices = (cellIndex: Index2D) : Index2D[] => {
  const neighborIndices : Index2D[] = [
        [cellIndex[0]-1, cellIndex[1]-1],
        [cellIndex[0]-1, cellIndex[1]  ],
        [cellIndex[0]-1, cellIndex[1]+1],
        [cellIndex[0]  , cellIndex[1]-1],
        [cellIndex[0]  , cellIndex[1]+1],
        [cellIndex[0]+1, cellIndex[1]-1],
        [cellIndex[0]+1, cellIndex[1]  ],
        [cellIndex[0]+1, cellIndex[1]+1]
      ];
  return neighborIndices.filter(index => index[0] >= 0 && index[0] < MAX_ROWS && index[1] >= 0 && index[1] < MAX_COLS);
}

export const generateCells = (notBombIndex? : Index2D) : Cell[][] => {
  let cells = new Array(MAX_ROWS).fill(null).map(_ => {
    return new Array(MAX_COLS).fill(null).map((_, i) => {
      return {
        value: CellValue.none,
        state: CellState.undiscovered
      }
    })
  });

  // place 10 bombs randomly, but not at or around where the user first clicks
  let bombCount = BOMB_COUNT;
  while(bombCount > 0){
    const rowIndex = Math.floor(Math.random()*MAX_ROWS);
    const colIndex = Math.floor(Math.random()*MAX_COLS);
    let isOrIsAdjacentToUsersFirstClick = false;
    if(notBombIndex){
      isOrIsAdjacentToUsersFirstClick = (notBombIndex
        && ([rowIndex, colIndex] === notBombIndex
          || Math.abs(rowIndex-notBombIndex[0]) <= 1
          || Math.abs(colIndex - notBombIndex[1]) <= 1))
    }
    if(!(cells[rowIndex][colIndex].value === CellValue.bomb || isOrIsAdjacentToUsersFirstClick)){
      cells[rowIndex][colIndex].value = CellValue.bomb;
      bombCount--;
    }
  }

  cells = cells.map((row, rowIndex) => {
    return row.map((cell, colIndex) => {
      let neighborCells = generateNeighborIndices([rowIndex, colIndex])

      const preSumArr : number[] = neighborCells.map((index) => {
        return cells[index[0]][index[1]].value === CellValue.bomb ? 1 : 0;
      })

      return cell.value === CellValue.bomb ? cell : {value: preSumArr.reduce( (acc, curr) =>  acc + curr, 0), state: cell.state};
    })
  })

  if(notBombIndex) {
    return bfsDiscover(cells, notBombIndex);
  } else {
    return cells;
  }
}

export const bfsDiscover = (cells: Cell[][], i2D: Index2D): Cell[][] => {
  const frontier : Array<Index2D> = new Array<Index2D>();
  const visited : Set<number> = new Set<number>();

  frontier.push(i2D);

  while(frontier.length > 0){
    const currI2D = frontier.pop();
    console.log(currI2D);
    console.log(frontier.length);
    let neighborIndices : Index2D[];
    if(currI2D !== undefined){
      neighborIndices = generateNeighborIndices(currI2D);
      neighborIndices.forEach((i2D: Index2D) => {
        if(!visited.has(i2D[0]*MAX_COLS+i2D[1])){
          if(cells[i2D[0]][i2D[1]].value !== CellValue.bomb){
            visited.add(i2D[0]*MAX_COLS+i2D[1]);
            if(cells[i2D[0]][i2D[1]].value === CellValue.none)
              frontier.push(i2D);
          }
        }
      })
    }
  }

  return cells.map((row, rowIndex) => {
    return row.map((currCell, colIndex) => {
      if(visited.has(rowIndex*MAX_COLS+colIndex)) {
        return {...currCell, state: CellState.discovered}
      } else {
        return currCell;
      }
    })
  })
}
