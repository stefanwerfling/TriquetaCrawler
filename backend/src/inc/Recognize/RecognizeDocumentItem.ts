/**
 * RecognizeDocumentItem
 */
export abstract class RecognizeDocumentItem {

    /**
     * getItemname
     */
    public abstract getItemname(): string;

    /**
     * getItem
     * @param docText
     */
    public abstract getItem(docText: string): Promise<string[]>;

}