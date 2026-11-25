/* Lightbox and theme toggle (spec sections 2 and 6.2). Loaded at the end of <body>.
   The saved theme itself is applied before the first paint by the inline script in <head>. */

/* Lightbox: each project image is a link to the full image, which opens in a dialog.
   Without JS the link opens the image directly. In projects with several images, previous
   and next buttons, the arrow keys, touch swipes and a counter step through that project's
   images, wrapping around at the ends. */
(() => {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.appendChild(document.createElement('img'));
    let links = [];
    let index = 0;

    const counter = document.createElement('p');
    counter.className = 'lightbox-counter';
    counter.setAttribute('aria-live', 'polite');

    const show = i => {
        index = (i + links.length) % links.length;
        lightboxImg.src = links[index].href;
        lightboxImg.alt = links[index].querySelector('img').alt;
        counter.textContent = `${index + 1} / ${links.length}`;
    };

    const navButton = (label, step) => {
        const button = lightbox.appendChild(document.createElement('button'));
        button.type = 'button';
        button.className = `lightbox-nav lightbox-${step < 0 ? 'prev' : 'next'}`;
        button.setAttribute('aria-label', label);
        button.addEventListener('click', () => show(index + step));
        return button;
    };
    const prev = navButton('Previous image', -1);
    const next = navButton('Next image', 1);
    next.autofocus = true;
    lightbox.appendChild(counter);

    document.querySelectorAll('.project-image').forEach(group => {
        const groupLinks = [...group.querySelectorAll('a')];
        groupLinks.forEach((link, i) => {
            link.addEventListener('click', e => {
                e.preventDefault();
                links = groupLinks;
                prev.hidden = next.hidden = counter.hidden = links.length < 2;
                show(i);
                lightbox.showModal();
            });
        });
    });

    // Touch swipes: a mostly horizontal swipe of over 50 px steps through the images. A second
    // finger (pinch) cancels it, and it is ignored while the page is pinch-zoomed.
    let start = null;
    let swiped = false;
    const zoomed = () => window.visualViewport?.scale > 1;
    lightbox.addEventListener('pointerdown', e => {
        swiped = false;
        start = e.pointerType === 'touch' && e.isPrimary && links.length > 1 && !zoomed()
            ? { id: e.pointerId, x: e.clientX, y: e.clientY } : null;
    });
    lightbox.addEventListener('pointerup', e => {
        if (!start || e.pointerId !== start.id) return;
        const dx = e.clientX - start.x;
        const dy = e.clientY - start.y;
        start = null;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) && !zoomed()) {
            swiped = true;
            show(index + (dx < 0 ? 1 : -1));
        }
    });
    lightbox.addEventListener('pointercancel', () => { start = null; });

    // The image and the backdrop close the lightbox; the buttons and swipes don't.
    lightbox.addEventListener('click', e => {
        if (swiped) swiped = false;
        else if (!e.target.closest('button')) lightbox.close();
    });

    lightbox.addEventListener('keydown', e => {
        if (links.length < 2) return;
        if (e.key === 'ArrowLeft') show(index - 1);
        else if (e.key === 'ArrowRight') show(index + 1);
        else return;
        e.preventDefault();
    });
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
