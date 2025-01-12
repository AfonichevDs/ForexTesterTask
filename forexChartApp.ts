import { Chart } from "./chartUI/chart.js";
import { ChartOptions } from "./chartUI/chartOptions";
import {
  ForexDataService,
  ForexDataServiceEvents,
} from "./services/forex-data.service.js";
import { LoaderService } from "./services/loader.service.js";
import { CurrenciesOptions } from "./types/CurrenciesOptions.enum.js";

export class ForexChartApp {
  private chart: Chart;
  private forexDataService: ForexDataService;
  private loaderService: LoaderService;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly pairSelect: HTMLSelectElement,
    private readonly volumeCheck: HTMLInputElement,
    private readonly chartOptions: ChartOptions
  ) {
    this.forexDataService = new ForexDataService();
    this.loaderService = new LoaderService();

    this.chart = new Chart(this.canvas, this.chartOptions);
  }

  public init(): void {
    this.bindEvents();
    this.populatePairSelect();

    this.chart.init();
    this.loadDefaultData();
  }

  private bindEvents(): void {
    this.volumeCheck.addEventListener("change", () => {
      this.chart.showVolume = this.volumeCheck.checked;
    });

    this.pairSelect.addEventListener("change", () => {
      const selectedPair = this.pairSelect.value as CurrenciesOptions;
      this.loadData(selectedPair);
    });

    this.forexDataService.addEventListener(
      ForexDataServiceEvents.DATA_LOADED,
      () => {
        this.onDataLoaded();
      }
    );
  }

  private populatePairSelect(): void {
    this.pairSelect.add(new Option(CurrenciesOptions.UsdEur));
    this.pairSelect.add(new Option(CurrenciesOptions.UsdJpy));

    this.pairSelect.value = this.pairSelect.options[0].value;
  }

  private loadDefaultData(): void {
    this.pairSelect.dispatchEvent(new Event("change"));
  }

  private onDataLoaded(): void {
    const data = this.forexDataService.get();
    if (!data) {
      throw new Error("No data returned.");
    }
    this.chart.setData(data);
  }

  private async loadData(selectedPair: CurrenciesOptions): Promise<void> {
    try {
      this.loaderService.showLoader();
      await this.forexDataService.load(selectedPair);
    } catch (err) {
      alert("Couldn’t load data: " + err);
    } finally {
      this.loaderService.hideLoader();
    }
  }
}
