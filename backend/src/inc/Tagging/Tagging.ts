import * as puppeteer from 'puppeteer';

/**
 * TaggingData
 */
export type TaggingData = {
    name: string;
    org_name: string;
    value: string;
};

/**
 * TaggingResult
 */
export type TaggingResult = {
    tags: TaggingData[];
};

/**
 * TaggingResultList
 */
export type TaggingResultList = {
    results: TaggingResult[];
};

/**
 * Tagging
 * https://gist.github.com/lancejpollard/1978404
 */
export class Tagging<T extends TaggingResult> {


    /**
     * _getMetas
     * @param page
     * @protected
     */
    protected static async _getMetas(page: puppeteer.Page): Promise<puppeteer.ElementHandle<HTMLMetaElement>[]> {
        return page.$$('meta');
    }

    /**
     * extractTags
     * @param metas
     * @param page
     */
    public async extractTags(metas: puppeteer.ElementHandle<HTMLMetaElement>[], page: puppeteer.Page): Promise<T|null> {
        return null;
    }

    /**
     * extract
     * @param tagExtractors
     * @param page
     */
    public static async extract<G extends Tagging<T>, T extends TaggingResult>(tagExtractors: G[], page: puppeteer.Page): Promise<TaggingResultList> {
        const metas = await Tagging._getMetas(page);

        const results: T[] = [];

        for await (const extractor of tagExtractors) {
            const result = await extractor.extractTags(metas, page);

            if (result) {
                results.push(result);
            }
        }

        return {
            results: results
        };
    }

}