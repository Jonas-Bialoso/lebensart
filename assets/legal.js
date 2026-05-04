/* ============================================================
   LEGAL PAGES — JS compartilhado
   - Reading progress bar
   - Back-to-top button
   - TOC active section highlight (IntersectionObserver)
============================================================ */
(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Reading progress bar ---------- */
  const progress = document.getElementById('reading-progress');
  if (progress) {
    function updateProgress() {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const pct = docHeight > 0 ? (scrolled / docHeight) * 100 : 0;
      progress.style.width = pct + '%';
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ---------- 2. Back-to-top ---------- */
  const btnTop = document.getElementById('back-to-top');
  if (btnTop) {
    function toggleBackToTop() {
      if (window.scrollY > 600) btnTop.classList.add('is-visible');
      else btnTop.classList.remove('is-visible');
    }
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    btnTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReduced ? 'auto' : 'smooth',
      });
    });
    toggleBackToTop();
  }

  /* ---------- 3. TOC active section ---------- */
  const tocList = document.getElementById('toc-list');
  const sections = document.querySelectorAll('.legal-content section[id]');
  if (tocList && sections.length) {
    const tocLinks = tocList.querySelectorAll('a[href^="#"]');
    const linkById = {};
    tocLinks.forEach((a) => {
      const id = a.getAttribute('href').slice(1);
      linkById[id] = a;
    });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const id = entry.target.id;
            const link = linkById[id];
            if (!link) return;
            if (entry.isIntersecting) {
              tocLinks.forEach((l) => l.classList.remove('is-active'));
              link.classList.add('is-active');
            }
          });
        },
        {
          /* Ativa o link quando a seção está no terço superior do viewport */
          rootMargin: '-20% 0px -70% 0px',
          threshold: 0,
        }
      );
      sections.forEach((s) => observer.observe(s));
    }

    /* Smooth scroll nos cliques do TOC */
    tocLinks.forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offsetTop, behavior: prefersReduced ? 'auto' : 'smooth' });
        history.pushState(null, '', '#' + id);
      });
    });
  }

})();
