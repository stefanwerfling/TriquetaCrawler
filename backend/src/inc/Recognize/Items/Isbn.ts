import {RecognizeDocumentItem} from '../RecognizeDocumentItem.js';

/**
 * Isbn
 */
export class Isbn extends RecognizeDocumentItem {

    /**
     * getItemname
     */
    public getItemname(): string {
        return 'ISBN';
    }

    /**
     * getItem
     * @param docText
     */
    public async getItem(docText: string): Promise<string[]> {
        let i;
        let sum;
        const isbnStr = docText.toUpperCase().replace(/[\x2D\xAD\u2010-\u2015\u2043\u2212]+/gu, '');
        const isbnRE = /\b(?:97[89]\s*(?:\d\s*){9}\d|(?:\d\s*){9}[\dX])\b/gu;
        const matches = isbnRE.exec(isbnStr);
        const isbns: string[] = [];

        if (matches) {
            for (const match of matches) {
                const isbn = match.replace(/\s+/gu, '');

                if (isbn.length === 10) {
                    // Verify ISBN-10 checksum
                    sum = 0;

                    for (i = 0; i < 9; i++) {
                        sum += isbn.charCodeAt(i) * (10 - i);
                    }

                    // check digit might be 'X'
                    sum += isbn[9] === 'X' ? 10 : isbn.charCodeAt(9);

                    if (sum % 11 === 0) {
                        isbns.push(isbn);
                    }
                } else {
                    // Verify ISBN 13 checksum
                    sum = 0;

                    // to make sure it's int
                    for (i = 0; i < 12; i += 2) {
                        sum += isbn.charCodeAt(i);
                    }

                    for (i = 1; i < 12; i += 2) {
                        sum += isbn.charCodeAt(i) * 3;
                    }

                    // add the check digit
                    sum += isbn.charCodeAt(12);

                    if (sum % 10 === 0) {
                        isbns.push(isbn);
                    }
                }
            }
        }

        return isbns;
    }

}