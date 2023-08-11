// http://www.lagotzki.de/pdftk/index.html#metadata

export class PdfTk {

    /**
     * metas
     * @protected
     */
    protected _metas: Map<string, string> = new Map<string, string>();

    /**
     * addMeta
     * @param name
     * @param value
     */
    public addMeta(name: string, value: string): void {
        this._metas.set(name, value);
    }

}