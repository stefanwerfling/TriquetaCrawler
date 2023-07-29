import path from 'path';
import {HtmlMetaTags} from '../../Tagging/HtmlMetaTags.js';
import {OpenGraphMetaTags} from '../../Tagging/OpenGraphMetaTags.js';
import {Tagging} from '../../Tagging/Tagging.js';
import {CrawlerJob} from './../../CrawlerJob.js';
import * as puppeteer from 'puppeteer';

/**
 * MediumJob
 */
export class MediumJob extends CrawlerJob {

    protected _baseUrl = 'https://medium.com/';
    protected _tag: string = '';

    /**
     * openTagPage
     * @param tag
     */
    public async openTagPage(tag: string): Promise<void> {
        if (this._page) {
            this._tag = tag;
            await this._page.goto(`${this._baseUrl}?tag=${tag}`, {waitUntil: 'networkidle2'});
            await this._page.setViewport({
                width: 0,
                height: 0
            });
        }
    }

    /**
     * countArticles
     */
    public async countArticles(): Promise<number> {
        if (this._page) {
            return this._page.$$eval('article', (element) => element.length);
        }

        return 0;
    }

    /**
     * getArticleLinks
     */
    public async getArticleLinks(): Promise<string[]> {
        if (this._page) {
            const elements = await this._page.$$('article');

            const articleLinks: string[] = [];

            for await (const article of elements) {
                const links = await article.$$('a');

                for await (const link of links) {
                    const href = await link.getProperty('href');
                    articleLinks.push(await href.jsonValue());
                }
            }

            return articleLinks;
        }

        return [];
    }

    /**
     * getArticleIds
     * @param links
     */
    public async getArticleIds(links?: string[]): Promise<string[]> {
        let splitLinks: string[];

        if (links) {
            splitLinks = links;
        } else {
            splitLinks = await this.getArticleLinks();
        }

        const articleIds: string[] = [];

        for (const link of splitLinks) {
            const parts = link.split('-');
            parts.shift();

            for (const apart of parts) {
                if (apart.indexOf('?') > 0) {
                    const subParts = apart.split('?source=');

                    if (subParts.length > 1) {
                        if (!articleIds.includes(subParts[0])) {
                            articleIds.push(subParts[0]);
                        }
                        break;
                    }
                }
            }
        }

        return articleIds;
    }

    /**
     * printArticleToPDF
     * @param articlePath
     * @param articleId
     */
    public async printArticleToPDF(articlePath: string, articleId: string): Promise<string|null> {
        if (this._page) {
            const pdfFile = path.join(articlePath, `${articleId}.pdf`);

            if (await CrawlerJob.fileExist(pdfFile)) {
                return null;
            }

            try {
                await this._page.goto(`${this._baseUrl}@/${articleId}`, {waitUntil: ['load', 'domcontentloaded']});

                // check is article ------------------------------------------------------------------------------------

                const selection = await this._page.$eval('section', (element) => {
                    return element.innerHTML;
                });

                if (selection.length === 0) {
                    return null;
                }

                await this._page.emulateMediaType('screen');

                // load all images -------------------------------------------------------------------------------------

                await this.autoScroll();

                // remove footer and more ------------------------------------------------------------------------------

                const footer = await this._page.$('footer');

                if (footer) {

                    // eslint-disable-next-line no-return-assign
                    await footer.evaluate((el): string => el.style.display = 'none');

                    // @ts-ignore
                    // nextElementSibling/previousElementSibling
                    // eslint-disable-next-line no-undef
                    const next = await this._page.evaluateHandle<puppeteer.ElementHandle<HTMLElement>>((el) => el.nextElementSibling, footer);

                    if (next) {
                        // @ts-ignore
                        // eslint-disable-next-line no-return-assign
                        await next.evaluate((el): string => el.style.display = 'none');
                    }
                }

                // pre fix style ---------------------------------------------------------------------------------------

                const pres = await this._page.$$('pre');

                for await (const pre of pres) {
                    // eslint-disable-next-line no-loop-func
                    await pre.evaluate((el): void => {
                        let enableScall = false;

                        if (el.scrollHeight > el.clientHeight) {
                            enableScall = true;
                        }

                        if (el.scrollWidth > el.clientWidth) {
                            enableScall = true;
                        }

                        if (enableScall) {
                            // eslint-disable-next-line no-undef
                            const children = el.children as HTMLCollectionOf<HTMLElement>;
                            const child = children.item(0);

                            if (child !== null) {
                                child.style.transform = 'scale(0.6)';
                            }
                        }
                    });
                }

                // extract meta informations ---------------------------------------------------------------------------

                try {
                    const taggings = await Tagging.extract(
                        [
                            new OpenGraphMetaTags(),
                            new HtmlMetaTags()
                        ],
                        this._page
                    );

                    console.log(taggings);
                } catch (ex) {
                    console.log(ex);
                    console.log('MediumJob::printArticleToPDF: can not extract meta informations!');
                }

                // print pdf -------------------------------------------------------------------------------------------

                // await this._page.waitForNetworkIdle();
                await this._page.pdf({
                    path: pdfFile,
                    format: 'A4',
                    printBackground: true,
                    timeout: 100000
                });

                // await this._page.screenshot({path: `${pdfFile}.png`});

                return pdfFile;
            } catch (e) {
                console.log(e);
                console.log('MediumJob::printArticleToPDF: article selection not found!');
            }
        } else {
            console.log('MediumJob::printArticleToPDF: page not init!');
        }

        return null;
    }

}