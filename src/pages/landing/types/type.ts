export type TokenDetailsDTO = {
  symbol: string;
  shortName: string;
  fullName: string;
  icon?: string;
  tvl?: number;
  tokenInfo: TokenInfoDTO[];
};

export type TokenInfoDTO = {
  label: string;
  value: string;
};
