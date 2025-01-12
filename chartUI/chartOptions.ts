export class ChartOptions {
    public readonly datePeriodDisplay = 3 * 60 * 60;
  
    constructor(
      public readonly displayPeriodHours: number,
      public readonly barWidth: number = 5,
      public readonly barSpacing: number = 2,
      public readonly volumeZoneHeight: number = 100,
      public readonly chartHeight: number = 0.8,
      public readonly chartWidth: number = 0.6, 
    ) {
      this.datePeriodDisplay = displayPeriodHours * 60 * 60;
    }
  }