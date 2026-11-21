/**
 * The site's URL prefix without a trailing slash: '' on the real site, '/ultramodern' for
 * the GitHub Pages preview (built with BASE_PATH=/ultramodern/). Plain Node scripts such as
 * build-cms-seed have no import.meta.env, so they always get ''.
 */
export const BASE = ((import.meta.env && import.meta.env.BASE_URL) || '/').replace(/\/+$/, '');
