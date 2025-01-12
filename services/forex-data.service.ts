import { CurrenciesOptions, CurrenciesToSourceMap } from "../types/CurrenciesOptions.enum.js";
import { IForexPeriodData } from "../types/IForexPeriodData.type.js";
import { usdEurDataUrl, usdJpyDataUrl } from "../utils/constants.js";

const DataSourcesMap: CurrenciesToSourceMap = {
  [CurrenciesOptions.UsdEur]: usdEurDataUrl,
  [CurrenciesOptions.UsdJpy]: usdJpyDataUrl,
};

export const ForexDataServiceEvents = {
  DATA_LOADED: "dataLoaded"
}

export class ForexDataService extends EventTarget {
  private data: IForexPeriodData[] | null = null;

  constructor() {
    super();
  }

  public async load(opt: CurrenciesOptions): Promise<void> {
    const response = await fetch(DataSourcesMap[opt]);

    this.data = await response.json();

    this.dispatchEvent(new CustomEvent(ForexDataServiceEvents.DATA_LOADED, { detail: this.data }));
  }

  public get(): IForexPeriodData[] | null {
    return this.data;
  }
}