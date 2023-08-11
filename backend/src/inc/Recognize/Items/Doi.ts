import {RecognizeDocumentItem} from '../RecognizeDocumentItem.js';

/**
 * Doi
 */
export class Doi extends RecognizeDocumentItem {

    /**
     * getItemname
     */
    public getItemname(): string {
        return 'DOI';
    }

    /**
     * getItem
     * @param docText
     */
    public async getItem(docText: string): Promise<string[]> {
        const DOIre = /\b10\.[0-9]{4,}\/[^\s&"']*[^\s&"'.,]/gu;
        const matches = DOIre.exec(docText);
        const dois: string[] = [];

        if (matches) {
            for (const match of matches) {
                let doi = match;

                if (doi.endsWith(')') && !doi.includes('(')) {
                    doi = doi.substring(0, doi.length - 1);
                }

                if (doi.endsWith('}') && !doi.includes('{')) {
                    doi = doi.substring(0, doi.length - 1);
                }

                dois.push(doi);
            }
        }

        return dois;
    }

}