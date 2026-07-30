// Local Development Clean URL Router
// Intercepts clean URLs and maps them to local .html files when testing locally.
(function() {
    const isLocal = location.hostname === 'localhost' || 
                    location.hostname === '127.0.0.1' || 
                    location.protocol === 'file:';
    
    if (isLocal) {
        document.addEventListener('click', function(e) {
            const anchor = e.target.closest('a');
            if (anchor && anchor.getAttribute('href')) {
                const href = anchor.getAttribute('href');
                // Check if it is an internal path link that we need to rewrite locally
                if (href.startsWith('/') || !href.includes(':')) {
                    const url = new URL(anchor.href, location.origin);
                    if (url.origin === location.origin) {
                        let path = url.pathname;
                        // Avoid rewriting home path, direct assets, files with extensions, or dot paths
                        if (path && path !== '/' && !path.endsWith('.html') && !path.includes('.')) {
                            e.preventDefault();
                            if (path.endsWith('/')) {
                                path = path.slice(0, -1);
                            }
                            const searchAndHash = url.search + url.hash;
                            
                            if (location.protocol === 'file:') {
                                const parts = location.pathname.split('/');
                                parts[parts.length - 1] = path.replace(/^\//, '') + '.html';
                                location.href = parts.join('/') + searchAndHash;
                            } else {
                                location.href = path + '.html' + searchAndHash;
                            }
                        }
                    }
                }
            }
        });
    }
})();
