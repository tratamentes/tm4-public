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



document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navigation = document.querySelector('.site-navigation');
  const dropdownItems = document.querySelectorAll('.has-dropdown');

  // Toggle menu mobile
  navToggle?.addEventListener('click', () => {
    const isExpanded = navigation.getAttribute('aria-expanded') === 'true';
    navigation.setAttribute('aria-expanded', !isExpanded);
    navToggle.setAttribute('aria-expanded', !isExpanded);
  });

  // Handle dropdown clicks on mobile
  dropdownItems?.forEach(item => {
    const link = item.querySelector('.nav-link');
    link?.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        item.classList.toggle('is-active');
      }
    });
  });
});