import { threadId } from 'worker_threads';
import { Publisher } from '../Tech/PublisherManager';

export namespace Table {

    export enum color {
        EMPTY = -1,
        BLACK = 0,
        WHITE = 1
    }

    var colors: { [id: number]: string } = {};
    colors[-1] = "Empty";
    colors[0] = "Black";
    colors[1] = "White";

    export class Line {
        private _pieces: number = 0;
        _color: color;

        constructor(pieces: number, color: color) {
            this._pieces = pieces;
            this._color = color;
        }

        public get pieces(): number {
            return this._pieces;
        }
        public set pieces(value: number) {
            this._pieces = value;
        }

        public isEmpty(): boolean {
            return this._color == color.EMPTY;
        }

        checkForColorChanges(): void {
            if (this._pieces == 0) {
                this._color = color.EMPTY;
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
        //Starting bottom right, playing black
        private static _defaultBoardState: Array<Line> =
            [new Line(2, color.WHITE), new Line(0, color.EMPTY), new Line(0, color.EMPTY), new Line(0, color.EMPTY), new Line(0, color.EMPTY), new Line(5, color.BLACK),
            new Line(0, color.EMPTY), new Line(3, color.BLACK), new Line(0, color.EMPTY), new Line(0, color.EMPTY), new Line(0, color.EMPTY), new Line(5, color.WHITE),
            new Line(2, color.BLACK), new Line(0, color.EMPTY), new Line(0, color.EMPTY), new Line(0, color.EMPTY), new Line(0, color.EMPTY), new Line(5, color.WHITE),
            new Line(0, color.EMPTY), new Line(3, color.WHITE), new Line(0, color.EMPTY), new Line(0, color.EMPTY), new Line(0, color.EMPTY), new Line(5, color.BLACK)]

        private _boardState: Array<Line> = Board._defaultBoardState;

        constructor() { }

        public reset(): void {
            this._boardState = Board._defaultBoardState;
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

        public _board: Board;

        constructor() {
            this._board = new Board();
        }

        public printBoard() {

        }

        public doMoves() {

        }


    }

}   // namespace Table