export class Utils {

    public static enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
        return Object.keys(obj).filter((k) => Number.isNaN(Number(k))) as K[];
    }

    public static enumValues<O extends object, K = O[keyof O]>(obj: O): K[] {
        return Object.values(obj).filter((k) => Number.isNaN(Number(k))) as K[];
    }

}