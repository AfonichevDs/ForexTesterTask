export enum CurrenciesOptions {
  UsdEur = "Usd/Eur",
  UsdJpy = "Usd/Jpy",
}

export type CurrenciesToSourceMap = {
  [key in CurrenciesOptions]: string;
};