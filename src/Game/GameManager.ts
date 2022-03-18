import Prando from 'prando'
import { Table } from '../Game/BoardManager'

export enum GamePhase {
    Inactive,
    Rolling,
    Double,
    FirstMove,
    SecondMove,
    AllDone,
}

const MovesForMT = 42

export class Player {
    private _currentPhase: GamePhase = GamePhase.Inactive
    private _color = Table.Color.BLACK
    private _movesToExit = 0 // !
    private _hasFaultedPieces = false

    constructor(color: Table.Color)
    {
        this._color = color
    }

    public get Color(): Table.Color
    {
        return this._color
    }

    public get HasFaultedPieces(): boolean
    {
        return this._hasFaultedPieces
    }

    public get Phase(): GamePhase {
        return this._currentPhase
    }

    public set Phase(phase: GamePhase) {
        this._currentPhase = phase
    }
}

export class Move {
    private _oldLine: Table.Line
    private _newLine: Table.Line
    private _color: Table.Color

    constructor(oldLine: Table.Line, newLine: Table.Line) {
        this._oldLine = oldLine
        this._newLine = newLine
        this._color = this._oldLine.color
    }

    public doMove(color: Table.Color): boolean {
        if(this._newLine.color != this._oldLine.color)
        {
            if(!this._newLine.canChangeColor)
            {
                console.log("Invalid move!: " + this.toString())

                return false
            }
        }

        Table.Line.updateLines(this._oldLine, this._newLine)
        this._color = color

        return true
    }

    public toString(): string
    {
        return String("Old Line + " + this._oldLine + " New Line " + this._newLine)
    }
}

export class DieRolled
{
    public First: number = -1
    public Second: number = -2
    public isDouble: boolean = false
    private _movesAvailable: number = 0

    constructor(first: number, second: number)
    {
        this.set(first, second)
    }

    public set(first: number, second: number)
    {
        this.First = first
        this.Second = second

        this.isDouble = this.First  === this.Second
        this._movesAvailable = this.isDouble ? 4 : 2
    }

    public get MovesAvailable(): number
    {
        return this._movesAvailable
    }

    public set MovesAvailable(value: number)
    {
        this._movesAvailable = value
    }

    public reverse(): DieRolled
    {
        return new DieRolled(this.Second, this.First)
    }

    public useMove(value: number): DieRolled
    {
        this.First = this.First == value ? (this.isDouble ? this.First : 0) : this.First
        //Don't care about second tbh

        if(this._movesAvailable > 0)
        {
            this._movesAvailable--
        }
        else
        {
            this.First = 0
            this.Second = 0
        }

        return this
    }

    public toString(): string
    {
        return this.First + ' ' + this.Second + ' ' + this.isDouble + ' ' + this.MovesAvailable
    }
}

export class GameManager {
    static SEED = 1554
    static RNG = new Prando(GameManager.SEED)

    private static _instance: GameManager

    private _board: Table.Board

    private _currentPlayerIndex = 0
    private _player: Array<Player> = new Array<Player>(2)
    private _dieRolled: DieRolled = new DieRolled(0, 0)

    private _movesLeft: number = 0

    constructor()
    {
        this._board = Table.Board.Instance;
    }

    public static get Instance() {
        return this._instance || (this._instance = new this())
    }

    public initialize(board: Table.Board)
    {
        this._board = board
    }

    public get Die(): DieRolled
    {
        return this._dieRolled
    }

    public get MovesLeft(): number{
        return this._movesLeft
    }
    
    private advanceTurn()
    {
        this._currentPlayerIndex = (this._currentPlayerIndex + 1) % 2
        // Notify players
    }

    public currentPlayer(): Player
    {
        return this._player[this._currentPlayerIndex]
    }

    public rollDie(): number {
        return GameManager.RNG.nextInt(1, 7)
    };

    public getUserColor(): Table.Color
    {
        return this._player[0].Color    // Probably do something else instead of verbose 0 and 1 for these, as this might not work
    }

    public getOpponentColor(): Table.Color
    {
        return this._player[1].Color
    }

    advancePhase(player: Player) {
        switch (player.Phase) {
            case GamePhase.Inactive:
                // Not in game
                break
            case GamePhase.Rolling:
                this._dieRolled.set(this.rollDie(), this.rollDie())

                // make lines clickable

                this.handlePhaseChange(player, this._dieRolled.isDouble ? GamePhase.Double : GamePhase.FirstMove)

                break
            case GamePhase.Double:
                break
            case GamePhase.FirstMove:
                break
            case GamePhase.SecondMove:
                break
            case GamePhase.AllDone:
                this.advanceTurn()
                //this.handlePhaseChange(player, )
                break
        }
    }

    private doFirstMove()
    {
        if(this._dieRolled.isDouble)
        {
            //this.handlePhaseChange()
        }
    }

    handlePhaseChange(player: Player, phase: GamePhase) {
        switch(phase)
        {
            case GamePhase.Double:
                // Check for number of possible moves
                // firstMove twice
                break
            case GamePhase.FirstMove:
                break
        }
    }

    recordMove(): boolean {
        return true;
    }

    submitMoves(): boolean {

        return true;
    }

    forwardGameMessages(): void {

    }
}
