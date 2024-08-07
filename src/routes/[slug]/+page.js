import { error } from '@sveltejs/kit';
import callApi from '$lib/callApi';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    try {
        const [pageData, pageMeta, toc, backlinks] = await Promise.all([
            callApi(`notes/${params.slug}`),
            callApi(`notes/${params.slug}/meta`),
            callApi(`notes/${params.slug}/toc`),
            callApi(`notes/${params.slug}/backlinks`)
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
