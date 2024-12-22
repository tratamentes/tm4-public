document.addEventListener('DOMContentLoaded', function () {
  // Lazy loading
  const lazyImages = document.querySelectorAll('[data-src]');
  const imageObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.src = entry.target.dataset.src;
        entry.target.removeAttribute('data-src');
        imageObserver.unobserve(entry.target);
      }
    });
  });
  lazyImages.forEach(img => imageObserver.observe(img));

  // Exit intent
  let shown = false;
  document.addEventListener('mouseleave', function (e) {
    if (e.clientY < 0 && !shown) {
      shown = true;
      document.querySelector('.exit-popup')?.classList.add('show');
    }
  });
});
