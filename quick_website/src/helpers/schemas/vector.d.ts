export interface IVector<T> {
    length: number;
    array: T[];
}
export declare class TDeserializable {
    static deserialize(data: Uint8Array): void;
}
export declare function deserializeCarrier<T>(func: any): (Uint8Array: any) => [T, Uint8Array];
export declare class TVector<T extends TDeserializable> implements IVector<T>, TDeserializable {
    length: number;
    array: T[];
    constructor(length: number, array: T[]);
    static deserialize<T extends TDeserializable>(deserialize: (Uint8Array: any) => [T, Uint8Array], data: Uint8Array): [TVector<T>, Uint8Array];
}
//# sourceMappingURL=vector.d.ts.map