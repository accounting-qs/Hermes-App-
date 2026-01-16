"use server";

import * as cheerio from 'cheerio';

export async function crawlLink(url: string) {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const html = await response.text();
        const $ = cheerio.load(html);

        // Strip non-content elements
        $('script, style, nav, footer, header, iframe, noscript').remove();

        // Target common main content areas
        const contentSelectors = ['article', 'main', '.content', '.post', '#content'];
        let contentText = "";

        for (const selector of contentSelectors) {
            const found = $(selector);
            if (found.length > 0) {
                contentText = found.text();
                break;
            }
        }

        // Fallback to body text if no main area found
        if (!contentText) {
            contentText = $('body').text();
        }

        // Clean text
        const cleanedText = contentText
            .replace(/\s+/g, ' ')
            .replace(/\n+/g, ' ')
            .trim();

        // Limit to reasonable size for first version (e.g. 50k chars)
        return cleanedText.substring(0, 50000);

    } catch (err: any) {
        console.error("Crawl failed:", err);
        throw err;
    }
}
