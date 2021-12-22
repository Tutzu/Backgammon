export namespace Publisher {

export class Subscriber
{
    _id : number = -1

    constructor(id: number)
    {
        this._id = id
    }
}

export class PublisherManager {
    private static _instance: PublisherManager;
    private static _clients: number;

    //hash table
    _subscribers : LinkedList<Subscriber>

    constructor() {
        this._subscribers = new LinkedList<Subscriber>()
        
    }

    public static get Instance() {
        return this._instance || (this._instance = new this())
    }

    public susbscribe() : number {
        let currentClients = PublisherManager._clients++
        let newSubscriber : Subscriber = new Subscriber(currentClients)
        
        this._subscribers.append(newSubscriber)
        
        return currentClients
    }

    unsubscribe(index: number) : void
    {
        //RemoveWithValue
        //this._subscribers.removeAt()
    }
}

}   // namespace Publisher