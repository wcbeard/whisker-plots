# Whisker Plots

Interactive data visualizations.

## Overview

Whisker Plots is a collection of interactive web-based tools for exploring data through visualizations and performing practical calculations. The project focuses on making complex information accessible and engaging through:

- **Data Visualizations**: Interactive charts and graphs
- **Calculators**: Practical tools for everyday questions with visual feedback

## Live Site

Visit the live site at: https://wcbeard.github.io/whisker-plots/

## Features

### Current Content

1. **Caffeine Calculator**
   - Calculate total caffeine intake from various beverages
   - See metabolism timeline based on caffeine half-life

### Planned Additions

None yet.

## Technology Stack

- **Plain HTML/CSS/JS** - No build process required
- **Tailwind CSS** - Utility-first CSS framework (via CDN)
- **GitHub Pages** - Static site hosting

## Project Structure

```
whisker-plots/
├── index.html                      # Homepage
├── .nojekyll                       # GitHub Pages config
├── README.md                       # This file
├── css/
│   └── custom.css                  # Custom styles
├── js/
│   ├── shared/
│   │   ├── navigation.js          # Reusable navigation component
│   │   └── footer.js              # Reusable footer component
│   └── calculators/
│       └── caffeine.js            # Caffeine calculator logic
├── calculators/
│   ├── index.html                 # Calculators index
│   └── caffeine.html              # Caffeine calculator
└── assets/
    └── images/                    # Images and icons
```

## Local Development

### Prerequisites

- Python 3 or Node.js (for local server)

### Running Locally

1. Clone the repository:
```bash
git clone https://github.com/wcbeard/whisker-plots.git
cd whisker-plots
```

2. Start a local server:

Using Python:
```bash
python -m http.server 8000
```

Or using Node.js:
```bash
npx http-server -p 8000
```

3. Open your browser to `http://localhost:8000`

### File Paths

All absolute paths in the code start with `/` to ensure compatibility with both local development and GitHub Pages deployment.

## Adding Content

### Add a New Visualization

1. Create a Vega spec: `data/vega-specs/[name]-spec.json`
2. Create HTML page: `visualizations/[name].html`
3. Follow the template in `visualizations/vega-demo.html`
4. Add a card to `visualizations/index.html`

See the [Vega-Lite documentation](https://vega.github.io/vega-lite/) for creating specifications.

### Add a New Calculator

1. Create HTML page: `calculators/[name].html`
2. Create logic file: `js/calculators/[name].js`
3. Follow the pattern in `calculators/caffeine.html` and `js/calculators/caffeine.js`
4. Add a card to `calculators/index.html`

### Add a Health Visualization

1. Create HTML page: `health/[topic].html`
2. Create Vega spec (if applicable): `data/vega-specs/[topic]-spec.json`
3. See `health/README.md` for detailed guidelines
4. Add a card to `health/index.html`

## Component Pattern

The site uses a simple component pattern with vanilla JavaScript:

- Navigation and footer HTML are stored as template literals in JS files
- Components are injected into pages via `DOMContentLoaded` event
- No build process or framework required
- Easy to maintain site-wide elements

## Deployment

The site is automatically deployed via GitHub Pages:

1. Push changes to the `main` branch
2. GitHub Pages will serve the site from the root directory
3. Site updates within a few minutes

### GitHub Pages Setup

1. Go to repository Settings > Pages
2. Source: Deploy from branch
3. Branch: `main`, Folder: `/ (root)`
4. Save

The `.nojekyll` file ensures GitHub Pages doesn't process files with Jekyll.

## Browser Support

Modern browsers with ES6 support:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## License

MIT License - feel free to use and modify for your own projects.

## Acknowledgments

- Built with [Vega](https://vega.github.io/vega/) and [Vega-Lite](https://vega.github.io/vega-lite/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Heroicons](https://heroicons.com/)
- Hosted on [GitHub Pages](https://pages.github.com/)