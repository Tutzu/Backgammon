import { Publisher } from '../Tech/PublisherManager';

export namespace Table {

    export enum Color {
        EMPTY = -1,
        BLACK = 0,
        WHITE = 1
    }

    var colors: { [id: number]: string } = {};
    colors[-1] = "Empty";
    colors[0] = "Black";
    colors[1] = "White";

    export class Line {
        static LineCounter = 0;

        private _lineId: number = 0;
        private _pieces: number = 0;
        private _color: Color;

        constructor(pieces: number, Color: Color) {
            this._lineId = Line.LineCounter++;
            this._pieces = pieces;
            this._color = Color;
        }

        public get lineId(): number {
            return this._lineId;
        }

        public get pieces(): number {
            return this._pieces;
        }
        public set pieces(value: number) {
            this._pieces = value;
        }

        public resetLineCounter() {
            console.log("Resetting Line Counter");

            Line.LineCounter = 0;
        }

        public isEmpty(): boolean {
            return this._color == Color.EMPTY;
        }

        checkForColorChanges(): void {
            if (this._pieces == 0) {
                this._color = Color.EMPTY;
                this._color = ~this._color;
            }
            else {
                this._color = this._pieces < 0 ? -this._color : this._color;
            }
        }

        public static updateLines(delta: number, line1: Line, line2: Line) {
            if (Math.abs(delta) > 4) {
                throw new Error("Delta shouldn't be higher than 4");
            }

            line1.pieces += delta;
            line1.checkForColorChanges();

            if (line2 != null) {
                line2.pieces += delta;
                line2.checkForColorChanges();
            }
        }

        public toString(): String {
            return String(this._pieces === 0 ?
                colors[this._color] :
                this._pieces + "  " + colors[this._color] + (this._pieces > 1 ? "s" : ""));
        }
    }

    export class Board {

        static LinesPerQuarter = 6;

        //Starting bottom right, playing black
        private static DefaultBoardState: Array<Line> =
            [new Line(2, Color.WHITE), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(5, Color.BLACK),
             new Line(0, Color.EMPTY), new Line(3, Color.BLACK), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(5, Color.WHITE),
             new Line(2, Color.BLACK), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(5, Color.WHITE),
             new Line(0, Color.EMPTY), new Line(3, Color.WHITE), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(5, Color.BLACK)]

        private static WhiteBoardState: Array<Line> =
            [new Line(2, Color.BLACK), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(5, Color.WHITE),
             new Line(0, Color.EMPTY), new Line(3, Color.WHITE), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(5, Color.BLACK),
             new Line(2, Color.WHITE), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(5, Color.BLACK),
             new Line(0, Color.EMPTY), new Line(3, Color.BLACK), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(0, Color.EMPTY), new Line(5, Color.WHITE)]

        private _boardState: Array<Line>;
        private _startingColor = Table.Color.EMPTY;

        constructor(playerColor: Table.Color = Table.Color.BLACK) {
            if(playerColor == Table.Color.EMPTY)
            {
                // wait for color input. Should probably never reach this. Assert?
            }

            this._startingColor = playerColor;
            this._boardState = playerColor == Table.Color.BLACK ? Board.DefaultBoardState : Board.WhiteBoardState;
        }

        public reset(): void {
            this._boardState = this._startingColor == Table.Color.BLACK ? Board.DefaultBoardState : Board.WhiteBoardState;
        }

        public getLine(line: number): Line {
            return this._boardState[line];
        }

        public isLineEmpty(line: number): boolean {
            return this._boardState[line].isEmpty();
        }

        public printBoard() {
            var delim: string;
            this._boardState.forEach((line, index) => {
                if (!(index % 12)) {
                    delim = "\n";
                } else if (!(index % 6)) {
                    delim = "\t";
                } else {
                    delim = "  ";
                }
                console.log(line.toString() + delim);
            });
        }
    }

    export class BoardManager {
        private static _instance: Publisher.PublisherManager;

        public Board: Board;

        constructor() {
            this.Board = new Board();
        }

        public printBoard() {

        }

        public doMoves() {

        }
    }
}   // namespace Table