export type TokenDetailsDTO = {
  symbol: string;
  shortName: string;
  fullName: string;
  tokenInfo: TokenInfoDTO[];
};

export type TokenInfoDTO = {
  label: string;
  value: string;
};
