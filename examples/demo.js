const root = document.documentElement;
const hdrQuery = window.matchMedia('(dynamic-range: high)');
const status = document.querySelector('#status');
const toggle = document.querySelector('#hdrToggle');
const toggleLabel = document.querySelector('#toggleLabel');
const strength = document.querySelector('#strength');
const strengthValue = document.querySelector('#strengthValue');
const comparisonValue = document.querySelector('#comparisonValue');
const tabs = document.querySelectorAll('[role="tab"]');
const composer = document.querySelector('.composer');

function updateStatus() {
  status.textContent = hdrQuery.matches
    ? 'dynamic-range: high matched'
    : 'dynamic-range: high not matched';
}

function updateStrength() {
  const value = Number(strength.value);
  const formattedValue = `${value}%`;

  root.style.setProperty('--demo-strength', formattedValue);
  root.style.setProperty('--demo-rest-strength', `${Math.round(value / 3)}%`);
  root.style.setProperty('--hdr-surface-rest', `${Math.round(value * 0.16)}%`);
  root.style.setProperty('--hdr-surface-focus', `${Math.round(value * 0.34)}%`);
  root.style.setProperty('--hdr-utility-rest', `${Math.round(value * 0.22)}%`);
  root.style.setProperty('--hdr-utility-hover', `${Math.round(value * 0.62)}%`);
  root.style.setProperty('--hdr-action-rest', `${Math.round(value * 0.4)}%`);
  root.style.setProperty('--hdr-action-hover', formattedValue);
  strengthValue.value = formattedValue;
  comparisonValue.value = formattedValue;
}

function updateToggle(enabled) {
  root.dataset.hdrEnabled = String(enabled);
  toggle.setAttribute('aria-pressed', String(enabled));
  toggleLabel.textContent = enabled ? 'HDR on' : 'HDR off';
}

toggle.addEventListener('click', () => {
  updateToggle(root.dataset.hdrEnabled !== 'true');
});

strength.addEventListener('input', updateStrength);
hdrQuery.addEventListener('change', updateStatus);

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle('tabItemActive', isActive);
      item.setAttribute('aria-selected', String(isActive));
    });
  });
});

composer.addEventListener('submit', (event) => {
  event.preventDefault();
});

updateStrength();
updateStatus();
