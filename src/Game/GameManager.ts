import Prando from 'prando';
import { Table } from '../Game/BoardManager'

export enum GamePhase {
    Inactive,
    Rolling,
    Double,
    FirstMove,
    SecondMove,
    AllDone,
}

export class Client {
    private _currentPhase: GamePhase = GamePhase.Inactive;

    public get Phase(): GamePhase {
        return this._currentPhase;
    }

    public set Phase(phase: GamePhase) {
        this._currentPhase = phase;
    }
}

export class Move {
    private _oldLine: Table.Line
    private _newLine: Table.Line
    private _color: Table.Color

    constructor(oldLine: Table.Line, newLine: Table.Line, color: Table.Color) {
        this._oldLine = oldLine;
        this._newLine = newLine;
        this._color = color;
    }

    public doMove(delta: number, color: Table.Color) {

        this._color = color;
    }
}

export class GameManager {

    static SEED = 1554;
    static RNG = new Prando(GameManager.SEED);

    private _clients: Array<Client> = new Array<Client>();
    
    public rollDie(): number {
        return GameManager.RNG.nextInt(1, 7);
    };

    computePossibleMoves(firstDie: number, secondDie: number): Array<Move>
    {
        var solutions: Array<Move> = new Array<Move>();

        return solutions;
    }

    advancePhase(client: Client, phase: GamePhase) {
        switch (client.Phase) {
            case GamePhase.Inactive:
                break
            case GamePhase.Rolling:
                const firstDie = this.rollDie()
                const secondDie = this.rollDie()
                break
            case GamePhase.Double:
                break
            case GamePhase.FirstMove:
                break
            case GamePhase.SecondMove:
                break
            case GamePhase.AllDone:
                break
        }
    }

    handlePhaseChange() {
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
