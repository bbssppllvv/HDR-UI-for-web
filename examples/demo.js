const root = document.documentElement;
const hdrQuery = window.matchMedia('(dynamic-range: high)');
const status = document.querySelector('#status');
const toggle = document.querySelector('#hdrToggle');
const toggleLabel = document.querySelector('#toggleLabel');
const strength = document.querySelector('#strength');
const strengthValue = document.querySelector('#strengthValue');
const comparisonValue = document.querySelector('#comparisonValue');
const modeButtons = document.querySelectorAll('.segmentItem');
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
  root.style.setProperty('--demo-rest-strength', `${Math.round(value * 0.4)}%`);
  root.style.setProperty('--demo-utility-strength', `${Math.round(value * 0.55)}%`);
  root.style.setProperty('--demo-action-strength', `${Math.round(value * 0.75)}%`);
  root.style.setProperty('--demo-action-hover-strength', `${Math.min(50, Math.round(value * 1.35))}%`);
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

modeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    modeButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle('segmentItemActive', isActive);
      item.setAttribute('aria-pressed', String(isActive));
    });
  });
});

composer.addEventListener('submit', (event) => {
  event.preventDefault();
});

updateStrength();
updateStatus();
