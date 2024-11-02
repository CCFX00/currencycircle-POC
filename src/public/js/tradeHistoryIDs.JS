// ObjectId implementation similar to MongoDB's ObjectId
class ObjectId {
    constructor() {
        const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
        const machineId = Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');
        const processId = Math.floor(Math.random() * 65536).toString(16).padStart(4, '0');
        const counter = Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');
        this.id = timestamp + machineId + processId + counter;
    }

    toHexString() {
        return this.id;
    }

    static isValid(id) {
        return typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
    }
}