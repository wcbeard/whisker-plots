# Health Visualizations Guide

This directory contains health-related data visualizations with simple, accessible explanations.

## Adding a New Health Visualization

Follow these steps to add a new health-related visualization to Whisker Plots:

### 1. Create the HTML Page

Create a new file in this directory: `health/[topic-name].html`

Use this template structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="[Description of your visualization]">
    <title>[Topic Name] | Whisker Plots</title>

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'whisker-blue': '#2563eb',
                        'whisker-purple': '#7c3aed',
                        'whisker-teal': '#14b8a6',
                    }
                }
            }
        }
    </script>

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="/css/custom.css">

    <!-- Vega Libraries (if needed) -->
    <script src="https://cdn.jsdelivr.net/npm/vega@5"></script>
    <script src="https://cdn.jsdelivr.net/npm/vega-lite@5"></script>
    <script src="https://cdn.jsdelivr.net/npm/vega-embed@6"></script>
</head>
<body class="bg-gray-50 min-h-screen flex flex-col">
    <!-- Navigation (injected) -->
    <div id="navigation"></div>

    <!-- Main content -->
    <main class="flex-grow container mx-auto px-4 py-8">
        <!-- Your content here -->
    </main>

    <!-- Footer (injected) -->
    <div id="footer"></div>

    <!-- Shared components -->
    <script src="/js/shared/navigation.js"></script>
    <script src="/js/shared/footer.js"></script>
</body>
</html>
```

### 2. Create the Vega Specification (if applicable)

If your visualization uses Vega or Vega-Lite, create a spec file:

`data/vega-specs/[topic-name]-spec.json`

See `data/vega-specs/demo-spec.json` for an example.

### 3. Structure Your Page Content

Every health visualization page should include:

#### Header Section
- Breadcrumb navigation
- Clear title
- Brief description

#### Visualization Section
- The interactive chart/graph
- Loading state with error handling

#### Explanation Section
Include:
- **What This Shows**: Describe the data and what the visualization represents
- **Key Insights**: Bullet points highlighting important findings
- **Data Source**: Cite where the data comes from
- **Methodology**: Briefly explain how the data was collected or calculated (if applicable)

#### Interactive Features Section
Explain how users can interact with the visualization

#### Important Disclaimers
Always include appropriate disclaimers, such as:
> Note: This information is for educational purposes only and should not be used as medical advice. Consult with healthcare professionals for personalized health guidance.

### 4. Add Card to Health Index

Update `health/index.html` to add a card linking to your new visualization:

```html
<a href="/health/[topic-name].html" class="card group no-underline">
    <div class="mb-4">
        <div class="w-full h-40 bg-gradient-to-br from-whisker-teal to-teal-600 rounded-lg flex items-center justify-center">
            <!-- Icon SVG -->
        </div>
    </div>
    <h3 class="text-xl font-bold mb-2 text-gray-800 group-hover:text-whisker-teal transition-colors">
        [Topic Title]
    </h3>
    <p class="text-gray-600 mb-3">
        [Brief description of the visualization]
    </p>
    <span class="text-whisker-teal font-semibold group-hover:text-teal-700 transition-colors">
        Explore &rarr;
    </span>
</a>
```

## Best Practices

### Data Quality
- Use reputable sources (peer-reviewed research, government health agencies, recognized health organizations)
- Always cite your data sources with links
- Include date of data collection/publication
- Note any limitations of the data

### Accessibility
- Provide text descriptions of all visualizations
- Use color schemes that are colorblind-friendly
- Ensure adequate color contrast (WCAG AA minimum)
- Include alt text for images

### Explanations
- Write in plain language, avoiding jargon
- Define medical/technical terms when necessary
- Use analogies and examples to clarify complex concepts
- Break information into digestible chunks

### Disclaimers
- Always include health disclaimers
- Make it clear when information is general vs. specific
- Encourage professional consultation for health decisions

### Visualization Design
- Keep charts simple and focused
- Use appropriate chart types for the data
- Include clear labels and legends
- Make interactive elements obvious
- Ensure responsive design for mobile devices

## Example Topics

Potential health visualization topics:
- Sleep quality and duration
- Exercise impact on various health metrics
- Nutrition and macronutrient breakdowns
- Heart rate zones
- Hydration levels
- Stress and cortisol patterns
- BMI and body composition
- Steps and activity levels
- Calorie expenditure
- Blood pressure ranges

## Resources

### Data Sources
- [CDC Data](https://data.cdc.gov/)
- [NIH Health Information](https://health.nih.gov/)
- [WHO Data](https://www.who.int/data)
- [PubMed](https://pubmed.ncbi.nlm.nih.gov/) for research studies

### Vega Resources
- [Vega-Lite Documentation](https://vega.github.io/vega-lite/docs/)
- [Vega Documentation](https://vega.github.io/vega/docs/)
- [Vega-Lite Examples](https://vega.github.io/vega-lite/examples/)

## Questions or Suggestions?

Open an issue on the GitHub repository to discuss new health visualization ideas or improvements to existing ones.
