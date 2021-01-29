export enum CellValue {
  none  ,
  one   ,
  two   ,
  three ,
  four  ,
  five  ,
  six   ,
  seven ,
  eight ,
  bomb
}

export enum CellState {
  undiscovered,
  discovered  ,
  flagged
}

export enum Face {
  glad = '😁',
  hesitant = '😶',
  lost = '💀',
  won = '😎'
}

export type Cell = { value: CellValue, state: CellState }

export type Index2D = [ row: number, col: number ]