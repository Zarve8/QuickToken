class WebMemoryAllocator  {
    serialize(data) {
        return JSON.stringify(data);
    }
    deserialize(data) {
        return new Uint8Array(JSON.parse(data))
    }
    loadByName(name) {
        const data = this.deserialize(global.localStorage.getItem(name));
        //console.log("Loading", name, "->", data);
        return data.length > 0? data : undefined;
    }
    writeByName(name, data) {
        global.localStorage.setItem(name, this.serialize(data));
        //console.log("Writing", name, "->", data);
    }
}


module.exports = WebMemoryAllocator;