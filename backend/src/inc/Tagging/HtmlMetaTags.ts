import * as puppeteer from 'puppeteer';
import {Utils} from '../Utils/Utils.js';
import {Tagging, TaggingData, TaggingResult} from './Tagging.js';

/**
 * https://www.w3schools.com/tags/tag_meta.asp
 */
export type HtmlTagData = {
    charset?: string;
    title?: string;
    description?: string;
    keywords?: string;
    author?: string;
    viewport?: string;
    theme_color?: string;
    referer?: string;
    robots?: string;
};

export enum HtmlTagKeys {
    TITLE = 'title',
    AUTHOR = 'author',
    ROBOTS = 'robots',
    REFERER = 'referrer',
    DESCRIPTION = 'description',
    VIEWPORT = 'viewport',
    THEME_COLOR = 'theme-color'
}

/**
 * HtmlTagsResult
 */
export type HtmlTagsResult = TaggingResult & {
    html: HtmlTagData;
};

/**
 * HtmlMetaTags
 */
export class HtmlMetaTags extends Tagging<HtmlTagsResult> {

    /**
     * extractTags
     * @param page
     */
    public async extractTags(metas: puppeteer.ElementHandle<HTMLMetaElement>[], page: puppeteer.Page): Promise<HtmlTagsResult|null> {
        let metaFound = false;
        const ht: HtmlTagData = {};
        const hm: TaggingData[] = [];

        const tagkeys = Utils.enumValues(HtmlTagKeys);

        for await (const meta of metas) {
            const name = await page.evaluate(
                (el) => el.getAttribute('name'),
                meta
            );

            if (name) {
                for await (const tagname of tagkeys) {
                    if (tagname === name) {
                        const content = await page.evaluate(
                            (el) => el.getAttribute('content'),
                            meta
                        );

                        if (content) {
                            metaFound = true;

                            hm.push({
                                name: tagname,
                                org_name: name,
                                value: content
                            });

                            switch (tagname) {
                                case HtmlTagKeys.TITLE:
                                    ht.title = content;
                                    break;

                                case HtmlTagKeys.AUTHOR:
                                    ht.author = content;
                                    break;

                                case HtmlTagKeys.DESCRIPTION:
                                    ht.description = content;
                                    break;

                                case HtmlTagKeys.VIEWPORT:
                                    ht.viewport = content;
                                    break;

                                case HtmlTagKeys.THEME_COLOR:
                                    ht.theme_color = content;
                                    break;

                                case HtmlTagKeys.REFERER:
                                    ht.referer = content;
                                    break;

                                case HtmlTagKeys.ROBOTS:
                                    ht.robots = content;
                                    break;
                            }
                        }
                    }
                }
            }
        }

        if (metaFound) {
            return {
                html: ht,
                tags: hm
            };
        }

        return null;
    }

}