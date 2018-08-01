export class Utils {
    public static base64ToArrayBuffer(base64: string): ArrayBuffer {
        let binary: string = window.atob(base64);
        let len: number = binary.length;
        let buffer: ArrayBuffer = new ArrayBuffer(len);
        let view: Uint8Array = new Uint8Array(buffer);
        for (let i = 0; i < len; i++) {
            view[i] = binary.charCodeAt(i);
        }
        return buffer;
    }
}
