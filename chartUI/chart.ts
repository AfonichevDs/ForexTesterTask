import { ForexPeriodData } from "../types/ForexPeriodData.type.js";
import { Bar } from "../types/Bar.type.js";
import { ChartOptions } from "./chartOptions.js";
import { formatDateTime } from "../utils/dateUtils.js";

export class Chart {
  private ctx: CanvasRenderingContext2D;
  private forexData: ForexPeriodData[] | null = null;

  private isDragging: boolean = false;
  private dragStartX: number = 0;
  private dragStartOffset: number = 0;
  private zoomLevel: number = 1.0;
  private xOffset: number = 0;

  private initialized: boolean = false;

  private totalDataWidth: number;

  private _showVolume: boolean = true;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly chartOptions: ChartOptions
  ) {
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    canvas.width = window.screen.width * chartOptions.chartHeight;
    canvas.height = window.screen.height * chartOptions.chartWidth;
  }

  public init() {
    this.initialized = true;
    this.addEventListeners();
    this.render();
  }

  public setData(data: ForexPeriodData[]): void {
    this.forexData = data;
    this.render();
  }

  public set showVolume(value: boolean) {
    this._showVolume = value;
    this.render();
  }
  public get showVolume() {
    return this._showVolume;
  }

  private addEventListeners() {
    this.canvas.addEventListener("mousedown", (ev) => {
      this.isDragging = true;
      this.dragStartX = ev.clientX;
      this.dragStartOffset = this.xOffset;
    });

    this.canvas.addEventListener("mousemove", (ev) => {
      if (this.isDragging) {
        const dx = ev.clientX - this.dragStartX;

        this.xOffset = this.dragStartOffset + dx;
        this.cropOffset();

        this.render();
      }
    });

    this.canvas.addEventListener("mouseup", () => {
      this.isDragging = false;
    });

    this.canvas.addEventListener("wheel", (ev) => {
      ev.preventDefault();

      const zoomIntensity = 0.01;
      if (ev.deltaY < 0) {
        this.zoomLevel += zoomIntensity;
      } else {
        this.zoomLevel = Math.max(0.1, this.zoomLevel - zoomIntensity);
      }

      this.render();
    });
  }

  private render() {
    if(!this.initialized) {
      return;
    }
    
    this.clearChart();
    this.drawAxes();

    if (this.forexData) {
      const bars = this.forexData.flatMap((x) => x.Bars);
      const prices = bars.flatMap((bar) => [bar.High, bar.Low]);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      const currBarWidth = (this.chartOptions.barWidth + this.chartOptions.barSpacing) * this.zoomLevel;
      this.totalDataWidth = bars.length * currBarWidth;
      console.log(this.totalDataWidth);
  
      this.drawYAxisLabels(minPrice, maxPrice);

      this.drawBars(this.forexData, minPrice, maxPrice);
    }
  }

  private clearChart(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawAxes(): void {
    this.ctx.strokeStyle = "#ccc";
    this.ctx.beginPath();

    const axisY = this.canvas.height - 20;
    this.ctx.moveTo(0, axisY);
    this.ctx.lineTo(this.canvas.width, axisY);
    this.ctx.stroke();
  }

  private priceToY(price: number, minPrice: number, maxPrice: number): number {
    const topMargin = 20;
    const bottomMargin = 80;

    const chartHeight = this.canvas.height - topMargin - bottomMargin;
    const priceRange = maxPrice - minPrice;

    if (priceRange === 0) {
      return this.canvas.height / 2;
    }

    return topMargin + (maxPrice - price) * (chartHeight / priceRange);
  }

  private drawBars(data: ForexPeriodData[], minPrice: number, maxPrice: number): void {
    const bars = data.flatMap((x) => x.Bars);

    const totalBarWidth =
      (this.chartOptions.barWidth + this.chartOptions.barSpacing) *
      this.zoomLevel;
    let lastLabelTime = 0;
    let barCounter = 0;

    const maxVolume = Math.max(...bars.map((bar) => bar.TickVolume));

    data.forEach((period) => {
      period.Bars.forEach((bar) => {
        // X coordinate for this bar
        const x = barCounter * totalBarWidth + this.xOffset;

        const yOpen = this.priceToY(bar.Open, minPrice, maxPrice);
        const yHigh = this.priceToY(bar.High, minPrice, maxPrice);
        const yLow = this.priceToY(bar.Low, minPrice, maxPrice);
        const yClose = this.priceToY(bar.Close, minPrice, maxPrice);

        const candleColor = bar.Close >= bar.Open ? "green" : "red";

        // high-low line
        this.ctx.beginPath();
        this.ctx.strokeStyle = candleColor;
        this.ctx.moveTo(
          x + this.chartOptions.barWidth * 0.5 * this.zoomLevel,
          yHigh
        );
        this.ctx.lineTo(
          x + this.chartOptions.barWidth * 0.5 * this.zoomLevel,
          yLow
        );
        this.ctx.stroke();

        // date label
        const currentTime = period.ChunkStart + bar.Time;
        if (
          currentTime - lastLabelTime >=
          this.chartOptions.datePeriodDisplay
        ) {
          const dateLabel = formatDateTime(currentTime);
          this.ctx.fillStyle = "#fff";
          this.ctx.fillText(dateLabel, x + 80, this.canvas.height - 5);
          lastLabelTime = currentTime;
        }

        const bodyTop = Math.min(yOpen, yClose);
        const bodyHeight = Math.abs(yClose - yOpen);
        this.ctx.fillStyle = candleColor;
        this.ctx.fillRect(
          x,
          bodyTop,
          this.chartOptions.barWidth * this.zoomLevel,
          Math.max(1, bodyHeight)
        );

        // volume
        if (this._showVolume) {
          this.drawVolume(bar, maxVolume, x);
        }

        barCounter++;
      });
    });
  }

  private drawVolume(bar: Bar, maxVolume: number, xCoord: number): void {
    const bottomAxisY = this.canvas.height - 20;
    if (maxVolume === 0) return;

    const volumeRatio = bar.TickVolume / maxVolume;
    const barHeight = volumeRatio * this.chartOptions.volumeZoneHeight;

    this.ctx.fillStyle = "#666";
    this.ctx.fillRect(
      xCoord,
      bottomAxisY - barHeight,
      this.chartOptions.barWidth * this.zoomLevel,
      barHeight
    );
  }

  private drawYAxisLabels(minPrice: number, maxPrice: number): void {
    const steps = 5;
    const stepValue = (maxPrice - minPrice) / (steps - 1);
  
    this.ctx.strokeStyle = "#444";
    this.ctx.fillStyle = "#fff";
    this.ctx.textAlign = "right";
    this.ctx.textBaseline = "middle";
  
    for (let i = 0; i < steps; i++) {
      const price = minPrice + i * stepValue;
      const y = this.priceToY(price, minPrice, maxPrice);
  
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
  
      this.ctx.fillText(price.toFixed(4), this.canvas.width - 5, y);
    }
  }

  private cropOffset(): void {
    if (this.totalDataWidth <= this.canvas.width) {
      this.xOffset = 0;
    } else {
      const rightMostOffset = 0;
      const leftMostOffset = this.canvas.width - this.totalDataWidth; 

      this.xOffset = Math.min(rightMostOffset, Math.max(leftMostOffset, this.xOffset));
    }
  }
}
