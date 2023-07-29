/**
 * Main
 */
import {Crawler} from './inc/Crawler.js';
import {MediumJob} from './inc/AdvancedSources/Medium/MediumJob.js';

(async(): Promise<void> => {
    const crawler = new Crawler();
    await crawler.init();

    let tokenUrl: string|undefined;

    // eslint-disable-next-line prefer-const
    // tokenUrl = 'https://<url>';

    const mJob = new MediumJob(crawler);
    await mJob.init(tokenUrl);

    if (tokenUrl === undefined) {
        await mJob.loadCookies('/home/app-user/app/data/cookies.json');
    }

    await mJob.openTagPage('<tag>');
    await mJob.autoScroll();
    await mJob.autoScroll();
    await mJob.autoScroll();

    const articleCount = await mJob.countArticles();
    console.log(`Count of articles: ${articleCount}`);

    /*if (articleCount > 0) {
        const articleIds = await mJob.getArticleIds();

        for await (const articleId of articleIds) {
            await mJob.printArticleToPDF('/home/app-user/app/data/', articleId);
        }
    }*/

    await mJob.printArticleToPDF('/home/app-user/app/data/', '<articleid>');

    // await mJob.printArticleToPDF('/home/app-user/app/data/', '<articleid>');

    // await mJob.saveCookies('/home/app-user/app/data/cookies.json');

    await crawler.close();

    console.log('Finish');
})();