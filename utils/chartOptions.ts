export class ChartOptions {
    public readonly DATE_PERIOD_DISPLAY = 3 * 60 * 60;
  
    constructor(
      public readonly displayPeriodHours: number,
      public readonly barWidth: number = 5,
      public readonly barSpacing: number = 2,
      public readonly volumeZoneHeight: number = 100
    ) {
      this.DATE_PERIOD_DISPLAY = displayPeriodHours * 60 * 60;
    }
  }