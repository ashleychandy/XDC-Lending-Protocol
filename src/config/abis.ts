// Centralized ABI imports
import ATokenAbi from "@/abis/AToken.json";
import CreditifyOracleAbi from "@/abis/CreditifyOracle.json";
import CreditifyProtocolDataProviderAbi from "@/abis/CreditifyProtocolDataProvider.json";
import PoolAbi from "@/abis/Pool.json";
import PoolAddressesProviderAbi from "@/abis/PoolAddressesProvider.json";
import RewardsControllerAbi from "@/abis/RewardsController.json";
import UiIncentiveDataProviderV3Abi from "@/abis/UiIncentiveDataProviderV3.json";
import UiPoolDataProviderV3Abi from "@/abis/UiPoolDataProviderV3.json";
import VariableDebtTokenAbi from "@/abis/VariableDebtToken.json";
import WalletBalanceProviderAbi from "@/abis/WalletBalanceProvider.json";
import WrappedTokenGatewayV3Abi from "@/abis/WrappedTokenGatewayV3.json";

// Export ABIs with proper typing
export const POOL_ABI = PoolAbi as const;
export const ATOKEN_ABI = ATokenAbi as const;
export const VARIABLE_DEBT_TOKEN_ABI = VariableDebtTokenAbi as const;
export const CREDITIFY_ORACLE_ABI = CreditifyOracleAbi as const;
export const CREDITIFY_PROTOCOL_DATA_PROVIDER_ABI =
  CreditifyProtocolDataProviderAbi as const;
export const UI_POOL_DATA_PROVIDER_V3_ABI = UiPoolDataProviderV3Abi as const;
export const WALLET_BALANCE_PROVIDER_ABI = WalletBalanceProviderAbi as const;
export const POOL_ADDRESSES_PROVIDER_ABI = PoolAddressesProviderAbi as const;
export const UI_INCENTIVE_DATA_PROVIDER_V3_ABI =
  UiIncentiveDataProviderV3Abi as const;
export const REWARDS_CONTROLLER_ABI = RewardsControllerAbi as const;
export const WRAPPED_TOKEN_GATEWAY_V3_ABI = WrappedTokenGatewayV3Abi as const;

// ERC20 ABI (standard functions used throughout)
export const ERC20_ABI = [
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "allowance",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transfer",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferFrom",
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "totalSupply",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "decimals",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "symbol",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "name",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
] as const;
