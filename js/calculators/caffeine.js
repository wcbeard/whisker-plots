// Caffeine Calculator — uses exponential decay model from coffee.ipynb

const MG_PER_CUP = 95;
const RESOLUTION = 0.1; // hours per data point
const HOURS = 24;
const NUM_POINTS = Math.round(HOURS / RESOLUTION) + 1;

// ── State ──────────────────────────────────────────────────────────────────────
let doses = [];          // { hour: number, amountMg: number }
let halfLifeHrs = 5;
let advancedMode = false;
let chart = null;

// ── Palette for individual dose curves ─────────────────────────────────────────
const DOSE_COLORS = [
  'rgba(124, 58, 237, 0.25)',   // purple
  'rgba(37, 99, 235, 0.25)',    // blue
  'rgba(20, 184, 166, 0.25)',   // teal
  'rgba(245, 158, 11, 0.25)',   // amber
  'rgba(239, 68, 68, 0.25)',    // red
  'rgba(16, 185, 129, 0.25)',   // emerald
  'rgba(168, 85, 247, 0.25)',   // violet
  'rgba(59, 130, 246, 0.25)',   // lighter blue
];

// ── Core math (mirrors coffee.ipynb) ───────────────────────────────────────────
function computeCaffeineLevels() {
  const timePoints = Array.from({ length: NUM_POINTS }, (_, i) => +(i * RESOLUTION).toFixed(2));
  const total = new Float64Array(NUM_POINTS);
  const perDose = [];

  for (const dose of doses) {
    const curve = new Float64Array(NUM_POINTS);
    for (let i = 0; i < NUM_POINTS; i++) {
      const t = timePoints[i];
      if (t >= dose.hour) {
        const elapsed = t - dose.hour;
        curve[i] = dose.amountMg * Math.exp(-Math.LN2 * elapsed / halfLifeHrs);
      }
    }
    perDose.push(curve);
    for (let i = 0; i < NUM_POINTS; i++) total[i] += curve[i];
  }

  return { timePoints, total, perDose };
}

// ── Format helpers ─────────────────────────────────────────────────────────────
function formatHour(h) {
  const hour24 = Math.floor(h) % 24;
  const suffix = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 || 12;
  return `${hour12} ${suffix}`;
}

function formatAmount(dose) {
  if (advancedMode) {
    return `${Math.round(dose.amountMg)} mg`;
  }
  const cups = dose.amountMg / MG_PER_CUP;
  return cups === 1 ? '1 cup' : `${cups % 1 === 0 ? cups : cups.toFixed(2)} cups`;
}

function formatYValue(mg) {
  if (advancedMode) {
    return `${Math.round(mg)} mg`;
  }
  const cups = mg / MG_PER_CUP;
  return cups.toFixed(1);
}

// ── DOM references ─────────────────────────────────────────────────────────────
let halfLifeSlider, halfLifeValueEl, advancedToggle;
let doseHourInput, doseCupsInput, doseMgInput;
let cupsInputGroup, mgInputGroup;
let addDoseBtn, clearAllBtn;
let doseListCard, doseListEl;
let chartCard, chartCanvas;

document.addEventListener('DOMContentLoaded', () => {
  halfLifeSlider    = document.getElementById('half-life-slider');
  halfLifeValueEl   = document.getElementById('half-life-value');
  advancedToggle    = document.getElementById('advanced-toggle');
  doseHourInput     = document.getElementById('dose-hour');
  doseCupsInput     = document.getElementById('dose-cups');
  doseMgInput       = document.getElementById('dose-mg');
  cupsInputGroup    = document.getElementById('cups-input-group');
  mgInputGroup      = document.getElementById('mg-input-group');
  addDoseBtn        = document.getElementById('add-dose-btn');
  clearAllBtn       = document.getElementById('clear-all-btn');
  doseListCard      = document.getElementById('dose-list-card');
  doseListEl        = document.getElementById('dose-list');
  chartCard         = document.getElementById('chart-card');
  chartCanvas       = document.getElementById('caffeine-chart');

  // Events
  halfLifeSlider.addEventListener('input', onHalfLifeChange);
  advancedToggle.addEventListener('click', toggleAdvanced);
  advancedToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleAdvanced(); }
  });
  addDoseBtn.addEventListener('click', addDose);
  clearAllBtn.addEventListener('click', clearAll);

  // Enter key on inputs
  doseHourInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addDose(); });
  doseCupsInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addDose(); });
  doseMgInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addDose(); });
});

// ── Half-life slider ───────────────────────────────────────────────────────────
function onHalfLifeChange() {
  halfLifeHrs = parseFloat(halfLifeSlider.value);
  halfLifeValueEl.textContent = `${halfLifeHrs.toFixed(1)} hours`;
  if (doses.length) renderChart();
}

// ── Advanced toggle ────────────────────────────────────────────────────────────
function toggleAdvanced() {
  advancedMode = !advancedMode;
  advancedToggle.classList.toggle('active', advancedMode);
  advancedToggle.setAttribute('aria-checked', advancedMode);

  cupsInputGroup.classList.toggle('hidden', advancedMode);
  mgInputGroup.classList.toggle('hidden', !advancedMode);

  // Re-render dose list labels and chart
  renderDoseList();
  if (doses.length) renderChart();
}

// ── Add dose ───────────────────────────────────────────────────────────────────
function addDose() {
  // Parse comma-separated hours
  const raw = doseHourInput.value.split(',').map(s => s.trim()).filter(Boolean);
  const hours = raw.map(s => parseInt(s, 10));
  if (hours.length === 0 || hours.some(h => isNaN(h) || h < 0 || h > 23)) {
    doseHourInput.focus();
    return;
  }

  let amountMg;
  if (advancedMode) {
    amountMg = parseFloat(doseMgInput.value);
    if (isNaN(amountMg) || amountMg <= 0) { doseMgInput.focus(); return; }
  } else {
    const cups = parseFloat(doseCupsInput.value);
    if (isNaN(cups) || cups <= 0) { doseCupsInput.focus(); return; }
    amountMg = cups * MG_PER_CUP;
  }

  for (const hour of hours) {
    doses.push({ hour, amountMg });
  }
  doses.sort((a, b) => a.hour - b.hour);

  renderDoseList();
  renderChart();

  // Show cards
  doseListCard.classList.remove('hidden');
  chartCard.classList.remove('hidden');
}

// ── Delete dose ────────────────────────────────────────────────────────────────
function deleteDose(index) {
  doses.splice(index, 1);
  renderDoseList();

  if (doses.length === 0) {
    doseListCard.classList.add('hidden');
    chartCard.classList.add('hidden');
    if (chart) { chart.destroy(); chart = null; }
  } else {
    renderChart();
  }
}

// ── Clear all ──────────────────────────────────────────────────────────────────
function clearAll() {
  doses = [];
  renderDoseList();
  doseListCard.classList.add('hidden');
  chartCard.classList.add('hidden');
  if (chart) { chart.destroy(); chart = null; }
}

// ── Render dose list ───────────────────────────────────────────────────────────
function renderDoseList() {
  doseListEl.innerHTML = '';
  doses.forEach((dose, i) => {
    const colorDot = DOSE_COLORS[i % DOSE_COLORS.length].replace('0.25', '1');
    const el = document.createElement('div');
    el.className = 'dose-item flex items-center justify-between p-3 rounded-lg border border-gray-100';
    el.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="w-3 h-3 rounded-full flex-shrink-0" style="background:${colorDot}"></span>
        <span class="font-medium text-gray-800">${formatHour(dose.hour)}</span>
        <span class="text-gray-500">—</span>
        <span class="text-gray-700">${formatAmount(dose)}</span>
      </div>
      <button onclick="deleteDose(${i})"
              class="text-gray-400 hover:text-red-500 transition-colors p-1"
              aria-label="Delete dose">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    `;
    doseListEl.appendChild(el);
  });
}

// ── Render chart ───────────────────────────────────────────────────────────────
function renderChart() {
  const { timePoints, total, perDose } = computeCaffeineLevels();

  // Convert values if in cups mode
  const scale = advancedMode ? 1 : 1 / MG_PER_CUP;

  const totalData = timePoints.map((t, i) => ({ x: t, y: total[i] * scale }));

  // Individual dose curves
  const doseDatasets = perDose.map((curve, idx) => ({
    label: `${formatHour(doses[idx].hour)} dose`,
    data: timePoints.map((t, i) => ({ x: t, y: curve[i] * scale })),
    borderColor: DOSE_COLORS[idx % DOSE_COLORS.length].replace('0.25', '0.6'),
    backgroundColor: DOSE_COLORS[idx % DOSE_COLORS.length],
    borderWidth: 1.5,
    borderDash: [4, 3],
    pointRadius: 0,
    fill: false,
    tension: 0.3,
    order: 2,
  }));

  const datasets = [
    {
      label: advancedMode ? 'Total caffeine (mg)' : 'Total caffeine (cups equivalent)',
      data: totalData,
      borderColor: '#7c3aed',
      backgroundColor: 'rgba(124, 58, 237, 0.08)',
      borderWidth: 3,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: '#7c3aed',
      fill: true,
      tension: 0.3,
      order: 1,
    },
    ...doseDatasets,
  ];

  const yAxisLabel = advancedMode ? 'Caffeine (mg)' : 'Cups of coffee in your system';

  if (chart) {
    chart.data.datasets = datasets;
    chart.options.scales.y.title.text = yAxisLabel;
    chart.options.plugins.tooltip.callbacks.label = tooltipLabelCb;
    chart.update('none');
    return;
  }

  chart = new Chart(chartCanvas, {
    type: 'line',
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            usePointStyle: true,
            pointStyle: 'line',
            padding: 16,
            font: { family: 'Inter', size: 12 },
            color: '#6b7280',
            filter: (item) => item.datasetIndex === 0 || doses.length <= 6,
          },
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.9)',
          titleFont: { family: 'Inter', size: 13, weight: '600' },
          bodyFont: { family: 'Inter', size: 12 },
          padding: 12,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            title: (items) => {
              if (!items.length) return '';
              const h = items[0].parsed.x;
              return formatHour(h);
            },
            label: tooltipLabelCb,
          },
        },
      },
      scales: {
        x: {
          type: 'linear',
          min: 0,
          max: 24,
          title: {
            display: true,
            text: 'Hour of day',
            font: { family: 'Inter', size: 13, weight: '600' },
            color: '#374151',
          },
          ticks: {
            stepSize: 2,
            callback: (v) => formatHour(v),
            font: { family: 'Inter', size: 11 },
            color: '#6b7280',
            maxRotation: 0,
          },
          grid: {
            color: 'rgba(0,0,0,0.04)',
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: yAxisLabel,
            font: { family: 'Inter', size: 13, weight: '600' },
            color: '#374151',
          },
          ticks: {
            font: { family: 'Inter', size: 11 },
            color: '#6b7280',
          },
          grid: {
            color: 'rgba(0,0,0,0.04)',
          },
        },
      },
      animation: {
        duration: 400,
        easing: 'easeOutCubic',
      },
    },
  });
}

function tooltipLabelCb(ctx) {
  const val = ctx.parsed.y;
  if (advancedMode) {
    return ` ${ctx.dataset.label}: ${Math.round(val)} mg`;
  }
  return ` ${ctx.dataset.label}: ${val.toFixed(2)} cups`;
}
