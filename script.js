const inputA = document.querySelector("#inputA");
const inputB = document.querySelector("#inputB");
const inputC = document.querySelector("#inputC");
const inputD = document.querySelector("#inputD");
const baseResult = document.querySelector("#baseResult");
const resultRatio = document.querySelector("#resultRatio");
const diffRange = document.querySelector("#diffRange");
const diffMax = document.querySelector("#diffMax");
const diffPrimary = document.querySelector("#diffPrimary");
const diffSoft = document.querySelector("#diffSoft");
const resultGrid = document.querySelector("#resultGrid");
const calculateButton = document.querySelector("#calculateButton");
const rates = Array.from({ length: 16 }, (_, index) => 0.85 + index * 0.01);

function formatNumber(value) {
  if (!Number.isFinite(value)) return "--";
  return new Intl.NumberFormat("ja-JP", {
    maximumFractionDigits: 0
  }).format(Math.floor(value));
}

function formatPercent(value) {
  if (!Number.isFinite(value)) return "--";
  return `${value.toFixed(2)}%`;
}

function clampPercent(value, max) {
  if (!Number.isFinite(value) || !Number.isFinite(max) || max <= 0) return 0;
  return Math.min(100, Math.max(0, value / max * 100));
}

function getBarColors(lowPercent) {
  if (lowPercent <= 15) {
    return {
      primary: "var(--bar-red)",
      soft: "var(--bar-red-soft)"
    };
  }

  if (lowPercent <= 50) {
    return {
      primary: "var(--bar-yellow)",
      soft: "var(--bar-yellow-soft)"
    };
  }

  return {
    primary: "var(--bar-green)",
    soft: "var(--bar-green-soft)"
  };
}

function updateDifferenceBar(c, results, hasValues) {
  diffMax.textContent = hasValues ? formatNumber(c) : "C";

  if (!hasValues || c <= 0) {
    resultRatio.textContent = "--";
    diffRange.textContent = "--";
    diffPrimary.style.width = "0%";
    diffSoft.style.left = "0%";
    diffSoft.style.width = "0%";
    diffPrimary.style.background = "var(--bar-green)";
    diffSoft.style.background = "var(--bar-green-soft)";
    return;
  }

  const differences = results.map((result) => c - result);
  const low = Math.min(...differences);
  const high = Math.max(...differences);
  const lowPercent = clampPercent(low, c);
  const highPercent = clampPercent(high, c);
  const resultPercentages = results.map((result) => result / c * 100);
  const minResultPercent = Math.min(...resultPercentages);
  const maxResultPercent = Math.max(...resultPercentages);
  const barColors = getBarColors(lowPercent);

  resultRatio.textContent = `${formatPercent(minResultPercent)} - ${formatPercent(maxResultPercent)}`;
  diffRange.textContent = `${formatNumber(low)} - ${formatNumber(high)}`;
  diffPrimary.style.background = barColors.primary;
  diffSoft.style.background = barColors.soft;
  diffPrimary.style.width = `${lowPercent}%`;
  diffSoft.style.left = `${lowPercent}%`;
  diffSoft.style.width = `${Math.max(0, highPercent - lowPercent)}%`;
}

function render() {
  const a = Number(inputA.value);
  const b = Number(inputB.value);
  const c = Number(inputC.value);
  const d = Number(inputD.value);
  const hasValues = inputA.value !== "" && inputB.value !== "" && inputC.value !== "" && inputD.value !== "";
  const base = hasValues && b !== 0 ? (22 * d * a / b) / 50 + 2 : NaN;
  const results = rates.map((rate) => base * rate);

  baseResult.textContent = formatNumber(base);
  updateDifferenceBar(c, results, hasValues);

  resultGrid.innerHTML = rates.map((rate, index) => {
    const result = results[index];
    const valueClass = hasValues ? "value" : "value empty";

    return `
      <article class="cell">
        <div class="rate">× ${rate.toFixed(2)}</div>
        <div class="${valueClass}">${formatNumber(result)}</div>
      </article>
    `;
  }).join("");
}

calculateButton.addEventListener("click", render);
render();
