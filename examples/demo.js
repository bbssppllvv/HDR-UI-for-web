const hdrQuery = window.matchMedia('(dynamic-range: high)');
const status = document.querySelector('#status');
const preview = document.querySelector('#preview');

function updateStatus() {
  status.textContent = hdrQuery.matches
    ? 'dynamic-range: high matched — HDR layer enabled'
    : 'dynamic-range: high not matched — HDR layer disabled';
}

const strength = document.querySelector('#strength');
const strengthOutput = document.querySelector('output[for="strength"]');

strength.addEventListener('input', () => {
  const value = `${strength.value}%`;
  preview.style.setProperty('--hdr-ui-strength', value);
  strengthOutput.value = value;
});

hdrQuery.addEventListener('change', updateStatus);
updateStatus();
