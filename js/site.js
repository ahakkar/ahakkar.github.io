/* Lightbox and theme toggle (spec sections 2 and 6.2). Loaded at the end of <body>.
   The saved theme itself is applied before the first paint by the inline script in <head>. */

/* Lightbox: each project image is a link to the full image, which opens in a dialog.
   Without JS the link opens the image directly. */
(() => {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.appendChild(document.createElement('img'));

    document.querySelectorAll('.project-image a').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            lightboxImg.src = link.href;
            lightboxImg.alt = link.querySelector('img').alt;
            lightbox.showModal();
        });
    });

    lightbox.addEventListener('click', () => lightbox.close());
})();

/* Theme toggle: the button is hidden in the HTML and only appears when JS runs. */
(() => {
    const root = document.documentElement;
    const toggle = document.getElementById('theme-toggle');
    const current = () => root.dataset.theme
        || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    const render = () => {
        const next = current() === 'dark' ? 'light' : 'dark';
        toggle.textContent = next === 'light' ? '☀ Light' : '☾ Dark';
        toggle.setAttribute('aria-label', `Switch to ${next} theme`);
    };

    toggle.addEventListener('click', () => {
        root.dataset.theme = current() === 'dark' ? 'light' : 'dark';
        try { localStorage.setItem('theme', root.dataset.theme); } catch (e) { /* not saved */ }
        render();
    });

    toggle.hidden = false;
    render();
})();
