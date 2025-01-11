import { IForexPeriodData } from "../types/IForexPeriodData.type";

export class ForexDataService {
  private data: IForexPeriodData[] | null = null;

  constructor() {}

  public async loadForexData(url: string): Promise<void> {
    const response = await fetch(url);

    this.data = await response.json();
  }

  public getData(): IForexPeriodData[] | null {
    return this.data;
  }
}