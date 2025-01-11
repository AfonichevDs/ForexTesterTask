import { Chart } from "./chart.js";
import { ForexDataService } from "./services/forex-data.service.js";
import { ChartOptions } from "./utils/chartOptions.js";
import {
  CurrenciesOpt,
  DataSourcesMap,
} from "./utils/constants.js";

// In real code, you'll have your actual options:
const chartOptions: ChartOptions = new ChartOptions(3);

export async function initApp() {
  const canvas = document.getElementById("chartCanvas") as HTMLCanvasElement;
  canvas.width = window.screen.width * 0.8;
  canvas.height = window.screen.height * 0.6;

  const pairSelect = document.getElementById("pairSelect") as HTMLSelectElement;
  const volumeCheck = document.getElementById("volumeCheck") as HTMLInputElement;

  const chart = new Chart(canvas, chartOptions);

  const forexDataService = new ForexDataService();

  volumeCheck.addEventListener("change", () => {
    chart.showVolume = volumeCheck.checked;
  });

  pairSelect.addEventListener("change", async () => {
    const selectedPair = pairSelect.value as CurrenciesOpt;

    try {
      showLoader();
      setTimeout(() => {}, 10000);
      await forexDataService.loadForexData(DataSourcesMap[selectedPair]);
      const data = forexDataService.getData();

      if (!data) {
        alert("Couldn't load data");
        return;
      }
      chart.setData(data);
      hideLoader();
    } catch (err) {
      alert("Couldn't load data: " + err);
    }
  });

  pairSelect.add(new Option(CurrenciesOpt.UsdEur, CurrenciesOpt.UsdEur));
  pairSelect.add(new Option(CurrenciesOpt.UsdJpy, CurrenciesOpt.UsdJpy));
  pairSelect.value = pairSelect.options[0].value;
  pairSelect.dispatchEvent(new Event("change"));

  chart.init();
}

function showLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = 'block';
    }
}

// Function to hide the loader
function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = 'none';
    }
}

initApp();