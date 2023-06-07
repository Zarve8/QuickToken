export interface IMemoryAllocator {
    loadByName: (name: string) => Uint8Array | undefined;
    writeByName: (name: string, data: Uint8Array) => void;
}
export declare class MemoryAllocator implements IMemoryAllocator {
    loadByName(name: string): Uint8Array | undefined;
    writeByName(name: string, data: Uint8Array): void;
}
//# sourceMappingURL=memory_allocator.d.ts.map