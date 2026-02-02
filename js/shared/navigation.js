// Navigation component for Whisker Plots
const navigationHTML = `
  <nav class="bg-slate-800 text-white shadow-lg">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center py-4">
        <!-- Logo/Site Title -->
        <a href="/index.html" class="text-2xl font-bold text-white hover:text-whisker-blue transition-colors">
          Whisker Plots
        </a>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex space-x-8">
          <a href="/index.html" class="nav-link hover:text-whisker-blue transition-colors">Home</a>
          <a href="/visualizations/index.html" class="nav-link hover:text-whisker-blue transition-colors">Visualizations</a>
          <a href="/calculators/index.html" class="nav-link hover:text-whisker-blue transition-colors">Calculators</a>
          <a href="/health/index.html" class="nav-link hover:text-whisker-blue transition-colors">Health</a>
        </div>

        <!-- Mobile Menu Button -->
        <button id="mobile-menu-button" class="md:hidden text-white focus:outline-none focus:ring-2 focus:ring-whisker-blue rounded p-2" aria-label="Toggle menu">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div id="mobile-menu" class="hidden md:hidden pb-4">
        <div class="flex flex-col space-y-2">
          <a href="/index.html" class="nav-link-mobile block py-2 px-4 hover:bg-slate-700 rounded transition-colors">Home</a>
          <a href="/visualizations/index.html" class="nav-link-mobile block py-2 px-4 hover:bg-slate-700 rounded transition-colors">Visualizations</a>
          <a href="/calculators/index.html" class="nav-link-mobile block py-2 px-4 hover:bg-slate-700 rounded transition-colors">Calculators</a>
          <a href="/health/index.html" class="nav-link-mobile block py-2 px-4 hover:bg-slate-700 rounded transition-colors">Health</a>
        </div>
      </div>
    </div>
  </nav>
`;

// Initialize mobile menu toggle
function initializeMobileMenu() {
  const menuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

// Highlight active page
function highlightActivePage() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link, .nav-link-mobile');

  navLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname;
    if (currentPath === linkPath || (currentPath === '/' && linkPath.includes('index.html'))) {
      link.classList.add('text-whisker-blue', 'font-semibold');
    }
  });
}

// Inject navigation on page load
document.addEventListener('DOMContentLoaded', () => {
  const navContainer = document.getElementById('navigation');
  if (navContainer) {
    navContainer.innerHTML = navigationHTML;
    initializeMobileMenu();
    highlightActivePage();
  }
});
