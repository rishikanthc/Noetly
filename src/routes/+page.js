import { error } from '@sveltejs/kit';
import callApi from '$lib/callApi';

/** @type {import('./$types').PageLoad} */
export async function load() {
    try {
        const [pageData, pageMeta, toc, backlinks] = await Promise.all([
            callApi('notes/home'),
            callApi('notes/home/meta'),
            callApi('notes/home/toc'),
            callApi('notes/home/backlinks')
        ]);
        
        if (!pageData || !pageMeta || !toc || !backlinks) {
            throw error(404, 'Page not found');
        }

        return {
            pageData,
            pageMeta,
            toc,
            backlinks,
        };
    } catch (err) {
        console.error('Error loading page data:', err);
        throw error(500, 'Error loading page data');
    }
}
