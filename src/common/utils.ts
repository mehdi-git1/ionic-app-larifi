export class Utils {
    public static base64ToArrayBuffer(base64: string): ArrayBuffer {
        const binary: string = window.atob(base64);
        const length: number = binary.length;
        const buffer: ArrayBuffer = new ArrayBuffer(length);
        const view: Uint8Array = new Uint8Array(buffer);
        for (let i = 0; i < length; i++) {
            view[i] = binary.charCodeAt(i);
        }
        return buffer;
    }

    /**
     * verifie l'existance d'une chaine de caractères en format json et la transforme en object.
     * @param stringJson la chaine de caractères concernée
     * @return object
     */
    public static fromStringToObject(stringJson: string): object{
        if (stringJson.includes('{') && stringJson.includes('}')){
            stringJson = stringJson.substring(stringJson.indexOf('{'), stringJson.indexOf('}') + 1 );
            stringJson = stringJson.replace('\\', '');
            try {
                return JSON.parse(stringJson);
            } catch (error) {
                return null;
            }
        }
        return null;
    }
}
