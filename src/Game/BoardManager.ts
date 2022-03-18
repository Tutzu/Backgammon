import { DieRolled, GameManager, Move } from './GameManager'

export namespace Table {

    export enum Color {
        EMPTY = -1,
        BLACK = 0,
        WHITE = 1
    }

    export enum Position {
        Out = 0,
        In = 1,
        Faulted = 25
    }

    var colors: { [id: number]: string } = {}
    colors[-1] = "Empty"
    colors[0] = "Black"
    colors[1] = "White"

    export class Line {
        static LineCounter = 0;

        private _canChangeColor: boolean = true;
        private _lineId: number = 0
        private _pieces: number = 0
        private _color: Color

        constructor(pieces: number, Color: Color) {
            this._lineId = Line.LineCounter++
            this._pieces = pieces
            this._canChangeColor = pieces <= 1
            this._color = Color
        }

        public get canChangeColor(): boolean {
            return this._canChangeColor
        }

        public get lineId(): number {
            return this._lineId
        }

        public get pieces(): number {
            return this._pieces
        }

        public set pieces(value: number) {
            this._pieces = value
            this._canChangeColor = value <= 1
        }

        public get color(): Color {
            return this._color
        }

        public resetLineCounter() {
            console.log("Resetting Line Counter")

            Line.LineCounter = 0
        }

        public isEmpty(): boolean {
            return this._color == Color.EMPTY
        }

        public canPlaceColor(color: Color): boolean
        {
            //debug check for color on out?
            return this._canChangeColor || this.color === color
        }

        checkForColorChanges(): void {
            if (this._pieces == 0) {
                this._color = Color.EMPTY
                this._color = ~this._color
            }
            else {
                this._color = this._pieces < 0 ? -this._color : this._color;
            }
        }

        public static updateLines(line1: Line, line2: Line) {
            line1.pieces--
            line1.checkForColorChanges()

            line2.pieces++
            line2.checkForColorChanges()
        }

        private isOut(): boolean
        {
            return this.lineId === Position.Out || this.lineId === Position.Faulted
        }

        private canMoveBy(delta: number): boolean
        {
            if(this.isOut() || delta === 0)
            {
                return false
            }

            var nextLine = this.nextLine(delta)
            return nextLine.canPlaceColor(this.color)
        }

        private nextLine(delta: number): Line
        {
            return Board.Instance.getLine(this.lineId + delta)
        }

        //private thatBlanaoDie(): DieRolled{}

        private generateMovesForDie(die: DieRolled): Array<Move>    //Also call on reverse die
        {
            var ret = new Array<Move>()
            
            var nextLine = this.nextLine(die.First)

            if(this.canMoveBy(die.First))
            {
                ret.push(new Move(this, nextLine))
                die.useMove(die.First)
            }

            var currentLine = nextLine
            nextLine = nextLine.nextLine(die.First)


            while(die.MovesAvailable > 0 && currentLine.canMoveBy(die.Second))
            {
                ret.push(new Move(currentLine, nextLine))
                die.useMove(die.Second)

                currentLine = nextLine
                nextLine = currentLine.nextLine(die.Second)
            }

            if(ret.length === 0)
            {
                console.warn('No moves for line ' + this.toString() + ' die ' + die.toString())
            }            

            return ret
        }

        handlePieceOut() {

        }

        handlePieceFaulted() {

        }

        public onClick()
        {
            var playerColor = this._color
            if(this._color != playerColor)
            {
                //Invalid
                return
            }

            var die = GameManager.Instance.Die
            var reverseDie = die.reverse()
            var movesAvailable = this.generateMovesForDie(die)
            var reverseMovesAvailable = this.generateMovesForDie(reverseDie)

            //show on screen

        }

        public toString(): String {
            return String(this._pieces === 0 ?
                colors[this._color] :
                this._pieces + "  " + colors[this._color] + (this._pieces > 1 ? "s" : ""))
        }
    }

    export class Board {
        static Instance: Board
        static LinesPerQuarter = 6

        //Starting bottom right, playing black
        private static DefaultBoardState: Array<Line> =
            [new Line(0, Color.EMPTY),
            new Line(2, Color.WHITE), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(5, Color.BLACK),
            new Line(0, Color.EMPTY), new Line(3, Color.WHITE), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(5, Color.BLACK),
            new Line(0, Color.EMPTY), new Line(3, Color.BLACK), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(5, Color.WHITE),
            new Line(2, Color.BLACK), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(5, Color.WHITE),
            new Line(0, Color.EMPTY)]

        private static WhiteBoardState: Array<Line> =
            [new Line(0, Color.EMPTY),
            new Line(2, Color.BLACK), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(5, Color.WHITE),
            new Line(0, Color.EMPTY), new Line(3, Color.WHITE), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(5, Color.BLACK),
            new Line(0, Color.EMPTY), new Line(3, Color.BLACK), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(5, Color.WHITE),
            new Line(2, Color.WHITE), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(5, Color.BLACK),
            new Line(0, Color.EMPTY)]

            private _startingColor = Table.Color.EMPTY
            private BoardState: Array<Line>

        constructor(playerColor: Table.Color = Table.Color.BLACK) {
            if(Board.Instance == null)
            {
                Board.Instance = this
            }
            
            if (playerColor == Table.Color.EMPTY) {
                // wait for color input. Should probably never reach this. Assert?
            }

            this._startingColor = playerColor
            this.BoardState = playerColor == Table.Color.BLACK ? Board.DefaultBoardState : Board.WhiteBoardState;
        }

        public reset(): void {
            this.BoardState = this._startingColor == Table.Color.BLACK ? Board.DefaultBoardState : Board.WhiteBoardState;
        }

        public getLine(line: number): Line
        {
            // Sanity checks

            if(0 <= line)
            {
                if(line >= Board.Instance.BoardState.length)
                {
                    return this.BoardState[Position.Faulted]
                }

                return this.BoardState[Position.Out]
            }
            return this.BoardState[line]
        }

        public getBlackLines(): Array<Line> {
            var lines = new Array<Line>()

            this.BoardState.forEach((line) => {
                if (line.color === Color.BLACK) {
                    lines.push(line)
                }
            });

            return lines;
        }

        public isLineEmpty(line: number): boolean {
            return this.BoardState[line].isEmpty()
        }

        public getMovesFrom():Array<Move>
        {
            return new Array<Move>(0)
        }

        public printBoard() {
            var delim: string
            this.BoardState.forEach((line, index) => {
                if (!(index % 12)) {
                    delim = "\n"
                } else if (!(index % 6)) {
                    delim = "\t"
                } else {
                    delim = "  "
                }
                console.log(line.toString() + delim)
            });
        }
    }

    export class BoardManager {
        public Board: Board

        constructor() {
            this.Board = new Board()
        }

        public printBoard() {

        }

        public doMoves(moves: Array<Move>) {

        }
    }
}   // namespace Table