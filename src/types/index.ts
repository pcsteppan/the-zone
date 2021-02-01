export enum GamePhase {
  apriori,
  playing,
  won,
  lost,
}

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

export enum ActionType {
  INIT,
  FIRST_CLICK,
  BFS_REVEAL,
  DISCOVER,
  FLAG,
  UNFLAG,
  STATUS_CLICK
}

export type Action =
  | { type: ActionType.STATUS_CLICK; }
  | { type: ActionType.INIT; }
  | { type: ActionType.FIRST_CLICK; i2D: Index2D }
  | { type: ActionType.BFS_REVEAL; i2D: Index2D }
  | { type: ActionType.DISCOVER; i2D: Index2D }
  | { type: ActionType.FLAG; i2D: Index2D }
  | { type: ActionType.UNFLAG; i2D: Index2D  }

export type Cell = { value: CellValue, state: CellState }

export type Index2D = [ row: number, col: number ]