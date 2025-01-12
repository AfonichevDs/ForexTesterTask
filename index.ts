import { ChartOptions } from "./chartUI/chartOptions.js";
import { ForexChartApp } from "./forexChartApp.js";

const chartOptions: ChartOptions = new ChartOptions(3);

export async function initApp() {
  const canvas = document.querySelector<HTMLCanvasElement>("#chartCanvas")!;

  const pairSelect = document.querySelector<HTMLSelectElement>("#pairSelect")!;
  const volumeCheck = document.querySelector<HTMLInputElement>("#volumeCheck")!;

  const chartApp = new ForexChartApp(canvas, pairSelect, volumeCheck, chartOptions);

  chartApp.init();
}

initApp();
