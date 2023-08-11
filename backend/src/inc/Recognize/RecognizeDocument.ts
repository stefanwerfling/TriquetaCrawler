import * as puppeteer from 'puppeteer';
import {Doi} from './Items/Doi.js';
import {RecognizeDocumentItem} from './RecognizeDocumentItem.js';

/**
 * RecognizeDocumentTextMode
 */
export enum RecognizeDocumentTextMode {
    PLAIN = 1,
    SELECT = 2
}

/**
 * RecognizeDocument
 */
export class RecognizeDocument {

    protected _extractedTextMode = RecognizeDocumentTextMode.SELECT;

    /**
     * _extractTextPlain
     * @param page
     * @protected
     */
    protected async _extractTextPlain(page: puppeteer.Page): Promise<string> {
        return page.$eval('*', (el) => {
            if (el instanceof HTMLElement) {
                return el.innerText;
            }

            return '';
        });
    }

    /**
     * _extractTextSelect
     * @param page
     * @protected
     */
    protected async _extractTextSelect(page: puppeteer.Page): Promise<string> {
        return page.$eval('*', (el) => {
            const selection = window.getSelection();

            if (selection) {
                const range = document.createRange();
                range.selectNode(el);
                selection.removeAllRanges();
                selection.addRange(range);

                if (window) {
                    const mySelect = window.getSelection();

                    if (mySelect) {
                        return mySelect.toString();
                    }
                }

                return '';
            }

            return '';
        });
    }

    /**
     * _extractText
     * @param page
     * @protected
     */
    protected async _extractText(page: puppeteer.Page): Promise<string> {
        switch (this._extractedTextMode) {
            case RecognizeDocumentTextMode.PLAIN:
                return this._extractTextPlain(page);

            case RecognizeDocumentTextMode.SELECT:
                return this._extractTextSelect(page);
        }

        return '';
    }

    /**
     * autoRecognizePageItems
     * @param page
     */
    public async autoRecognizePageItems(page: puppeteer.Page): Promise<Map<string, string[]>> {
        const pageText = await this._extractText(page);

        const content: Map<string, string[]> = new Map();

        const items: RecognizeDocumentItem[] = [
            new Doi()
        ];

        for await (const item of items) {
            const name = item.getItemname();
            const data = await item.getItem(pageText);

            content.set(name, data);
        }

        return content;
    }

}