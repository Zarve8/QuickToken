export interface IMemoryAllocator {
    loadByName: (name: string) => Uint8Array | undefined,
    writeByName: (name: string, data: Uint8Array) => void
}


export class MemoryAllocator implements IMemoryAllocator{
    loadByName(name: string): Uint8Array | undefined {
        return undefined;
    }
    writeByName(name: string, data: Uint8Array) {}
}