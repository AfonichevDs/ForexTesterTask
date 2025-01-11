import { IBar } from "./IBar.type";

export interface IForexPeriodData {
    ChunkStart: number;
    Bars: IBar[];
}