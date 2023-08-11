import fs from 'fs/promises';
import {Crawler} from './Crawler.js';
import * as puppeteer from 'puppeteer';

/**
 * CrawlerJob
 */
export class CrawlerJob {

    protected _crawler: Crawler;
    protected _page?: puppeteer.Page;
    protected _userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36';

    public constructor(crawler: Crawler) {
        this._crawler = crawler;
    }

    /**
     * init
     * @param beginUrl
     */
    public async init(beginUrl?: string, cookies?: any): Promise<any> {
        if (this._crawler.isInit()) {
            const page = await this._crawler.newPage();

            if (page === null) {
                console.log('CrawlerJob::init: page not init!');
            } else {
                this._page = page;
                await this._page.setUserAgent(this._userAgent);

                if (cookies) {
                    console.log('CrawlerJob::init: set cookies');

                    this._page.setCookie(cookies);
                }

                if (beginUrl) {
                    console.log(`CrawlerJob::init: goto begin url: ${beginUrl}`);

                    await this._page.goto(beginUrl);
                }
            }
        }
    }

    /**
     * gotTo
     * @param url
     */
    public async gotTo(url: string): Promise<void> {
        if (this._page) {
            await this._page.goto(url);
        } else {
            console.log('CrawlerJob::gotTo: page not init!');
        }
    }

    /**
     * saveCookies
     * @param file
     */
    public async saveCookies(file: string): Promise<void> {
        if (this._page) {
            const cookies = await this._page.cookies();
            const cookieJson = JSON.stringify(cookies, null, 2);

            await fs.writeFile(file, cookieJson, {
                flag: 'w+'
            });
        } else {
            console.log('CrawlerJob::saveCookies: page not init!');
        }
    }

    /**
     * fileExist
     * @param file
     */
    public static async fileExist(file: string): Promise<boolean> {
        try {
            return (await fs.stat(file)).isFile();
        } catch (e) {
            return false;
        }
    }

    /**
     * loadCookies
     * @param file
     */
    public async loadCookies(file: string): Promise<void> {
        if (this._page) {
            if (await CrawlerJob.fileExist(file)) {
                const cookiesString = await fs.readFile(file);
                const cookies = JSON.parse(cookiesString.toString());
                await this._page.setCookie(...cookies);

                console.log(`CrawlerJob::loadCookies: file load: ${file}`);
            } else {
                console.log('CrawlerJob::loadCookies: file not found!');
            }
        } else {
            console.log('CrawlerJob::loadCookies: page not init!');
        }
    }

    public async autoScroll(): Promise<void> {
        if (this._page) {

            /*
             * await this._page.evaluate('window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth"})');
             * await this._page.waitForTimeout(2000);
             */

            await this._page.evaluate(async(): Promise<void> => {
                await new Promise<void>((resolve) => {
                    const i = setInterval(() => {
                        // eslint-disable-next-line no-undef
                        window.scrollBy(0, window.innerHeight);
                        // @ts-ignore
                        // eslint-disable-next-line no-undef
                        if (document.scrollingElement.scrollTop + window.innerHeight >= document.scrollingElement.scrollHeight) {
                            // eslint-disable-next-line no-undef
                            window.scrollTo(0, 0);
                            clearInterval(i);
                            resolve();
                        }
                    }, 100);
                });
            });
        }
    }

}