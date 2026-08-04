const root = document.documentElement;
const hdrQuery = window.matchMedia('(dynamic-range: high)');
const status = document.querySelector('#status');
const toggle = document.querySelector('#hdrToggle');
const toggleLabel = document.querySelector('#toggleLabel');
const strength = document.querySelector('#strength');
const strengthValue = document.querySelector('#strengthValue');
const comparisonValue = document.querySelector('#comparisonValue');

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

updateStrength();
updateStatus();
