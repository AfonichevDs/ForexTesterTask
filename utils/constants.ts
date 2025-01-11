export const usdEurDataUrl =
  "https://beta.forextester.com/data/api/Metadata/bars/chunked?Broker=Advanced&Symbol=EURUSD&Timeframe=1&Start=57674&End=59113&UseMessagePack=false";
export const usdJpyDataUrl =
  "https://beta.forextester.com/data/api/Metadata/bars/chunked?Broker=Advanced&Symbol=USDJPY&Timeframe=1&Start=57674&End=59113&UseMessagePack=false";

export enum CurrenciesOpt {
  UsdEur = "Usd/Eur",
  UsdJpy = "Usd/Jpy",
}

export type CurrenciesToSourceMap = {
  [key in CurrenciesOpt]: string;
};

export const DataSourcesMap: CurrenciesToSourceMap = {
  [CurrenciesOpt.UsdEur]: usdEurDataUrl,
  [CurrenciesOpt.UsdJpy]: usdJpyDataUrl,
};
