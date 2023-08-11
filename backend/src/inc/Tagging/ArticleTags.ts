/**
 * https://sharkcoder.com/html/meta
 */
import * as puppeteer from 'puppeteer';
import {Tagging, TaggingResult} from './Tagging.js';

/**
 * ArticleTagData
 */
export type ArticleTagData = {
    published_time: string;
    modified_time: string;
    expiration_time: string;
    author: string;
    publisher: string;
    section: string;
    tag: string[];
};

/**
 * ArticleTagsResult
 */
export type ArticleTagsResult = TaggingResult & {
    article: ArticleTagData;
};

/**
 * ArticleTags
 */
export class ArticleTags extends Tagging<ArticleTagsResult> {

    public async extractTags(metas: puppeteer.ElementHandle<HTMLMetaElement>[], page: puppeteer.Page): Promise<ArticleTagsResult|null> {


        return null;
    }

}