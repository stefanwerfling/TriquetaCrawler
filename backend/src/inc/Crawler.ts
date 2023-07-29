import * as puppeteer from 'puppeteer';
import {CrawlerJob} from './CrawlerJob.js';

export class Crawler {

    protected _isInit: boolean = false;
    protected _browser?: puppeteer.Browser;

    /**
     * init
     */
    public async init(): Promise<void> {
        this._browser = await puppeteer.launch({
            headless: 'new',
            ignoreHTTPSErrors: true,
            // use Chromium installed with `apt` (solves Problem 1)
            executablePath: '/usr/bin/chromium',
            args: [
                // run without sandbox (solves Problem 3)
                '--no-sandbox'

                /*
                 * other launch flags (discussed in Problem 3)
                 * '--disable-gpu,
                 * '--disable-dev-shm-usage',
                 * '--disable-setuid-sandbox',
                 */
            ]
        });

        this._isInit = true;
    }

    /**
     * newPage
     */
    public async newPage(): Promise<puppeteer.Page|null> {
        if (this._browser) {
            return this._browser.newPage();
        }

        return null;
    }

    /**
     * newJob
     */
    public async newJob(): Promise<CrawlerJob> {
        const job = new CrawlerJob(this);
        await job.init();

        return job;
    }

    /**
     * isInit
     */
    public isInit(): boolean {
        return this._isInit;
    }

    /**
     * close
     */
    public async close(): Promise<void> {
        this._isInit = false;

        if (this._browser) {
            await this._browser.close();
        }
    }

}