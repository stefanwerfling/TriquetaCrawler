import * as puppeteer from 'puppeteer';
import {Utils} from '../Utils/Utils.js';
import {Tagging, TaggingData, TaggingResult} from './Tagging.js';

/**
 * OgTagsData
 */
export type OgTagsData = {
    title?: string;
    description?: string;
    type?: string;
    url?: string;
    site_name?: string;
    image?: string;
};

/**
 * OgTagsResult
 */
export type OgTagsResult = TaggingResult & {
    ogdata: OgTagsData;
};

/**
 * Og tag keys
 */
export enum OgTagKeys {
    TITLE = 'title',
    DESCRIPTION = 'description',
    TYPE = 'type',
    URL = 'url',
    SITE_NAME = 'site_name',
    IMAGE = 'image'
}

/**
 * OpenGraphMetaTags
 * https://www.promomasters.at/blog/open-graph-meta-tags/
 */
export class OpenGraphMetaTags extends Tagging<OgTagsResult> {

    public static NAMESPACE = 'og';
    public static SEPERATOR = ':';

    /**
     * extractTags
     * @param metas
     * @param page
     */
    public async extractTags(metas: puppeteer.ElementHandle<HTMLMetaElement>[], page: puppeteer.Page): Promise<OgTagsResult|null> {
        let ogFounds = false;
        const og: OgTagsData = {};
        const hm: TaggingData[] = [];

        const tagkeys = Utils.enumValues(OgTagKeys);

        for await (const meta of metas) {
            const property = await page.evaluate(
                (el) => el.getAttribute('property'),
                meta
            );

            if (property) {
                for await (const tagname of tagkeys) {
                    if (`${OpenGraphMetaTags.NAMESPACE}${OpenGraphMetaTags.SEPERATOR}${tagname}` === property) {
                        const content = await page.evaluate(
                            (el) => el.getAttribute('content'),
                            meta
                        );

                        if (content) {
                            ogFounds = true;

                            hm.push({
                                name: tagname,
                                org_name: property,
                                value: content
                            });

                            switch (tagname) {
                                case OgTagKeys.SITE_NAME:
                                    og.site_name = content;
                                    break;

                                case OgTagKeys.TITLE:
                                    og.title = content;
                                    break;

                                case OgTagKeys.DESCRIPTION:
                                    og.description = content;
                                    break;

                                case OgTagKeys.TYPE:
                                    og.type = content;
                                    break;

                                case OgTagKeys.URL:
                                    og.url = content;
                                    break;

                                case OgTagKeys.IMAGE:
                                    og.image = content;
                                    break;
                            }
                        }
                    }
                }
            }
        }

        if (ogFounds) {
            return {
                ogdata: og,
                tags: hm
            };
        }

        return null;
    }

}