import BN from "bn.js";


export interface IVector<T> {
    length: number;
    array: T[];
}

export class TDeserializable {
    static deserialize(data: Uint8Array) {};
}

export function deserializeCarrier<T>(func: any): (Uint8Array) => [T, Uint8Array] { //@ts-ignore
    return (data: Uint8Array) => {return func(data)};
}

export class TVector<T extends TDeserializable> implements IVector<T>, TDeserializable {
    length: number;
    array: T[]
    constructor(length: number, array: T[]) {
        this.length = length;
        this.array = array;
    }
    static deserialize<T extends TDeserializable>(deserialize: (Uint8Array) => [T, Uint8Array], data: Uint8Array): [TVector<T>, Uint8Array] {
        const length = new BN(data.slice(0, 4), "le").toNumber();
        data = data.slice(4);
        let array: T[] = [];
        for(let i = 0; i < length; i++) {
            let child: T;
            [child, data] = deserialize(data);
            array.push(child);
        }
        return [new TVector<T>(length, array), data];
    }
}