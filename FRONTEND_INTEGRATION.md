# Frontend Integration Guide - Creditify V3

## Essential Contract Addresses for Frontend

### Core Protocol Contracts

#### 1. **Pool (Main Entry Point)** ⭐ MOST IMPORTANT

```
CONTRACT_POOLPROXY=0x35d4c4c4ca208F50330edD0Bb1592be7e29bE861
```

**Purpose**: Main contract for all user interactions
**Use for**:

- Supply assets
- Withdraw assets
- Borrow assets
- Repay loans
- Get user account data
- Get reserve data

**Key Methods**:

```solidity
function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)
function withdraw(address asset, uint256 amount, address to)
function borrow(address asset, uint256 amount, uint256 interestRateMode, uint16 referralCode, address onBehalfOf)
function repay(address asset, uint256 amount, uint256 interestRateMode, address onBehalfOf)
function getUserAccountData(address user) returns (totalCollateral, totalDebt, availableBorrow, currentLiquidationThreshold, ltv, healthFactor)
function getReserveData(address asset) returns (ReserveData)
```

---

#### 2. **UI Pool Data Provider** ⭐ ESSENTIAL FOR UI

```
CONTRACT_UIPOOLDATAPROVIDER=0x547593068Df1496C7dE4fcabE64E1B214B26Ab77
```

**Purpose**: Aggregated data for displaying in UI
**Use for**:

- Get all reserves data at once
- Get user reserves data
- Display APY, utilization, available liquidity

**Key Methods**:

```solidity
function getReservesData(address provider) returns (AggregatedReserveData[] memory)
function getUserReservesData(address provider, address user) returns (UserReserveData[] memory)
```

**Returns**:

- Reserve name, symbol, decimals
- Total liquidity, available liquidity
- Total borrowed (stable + variable)
- Liquidity rate, variable borrow rate, stable borrow rate
- LTV, liquidation threshold, liquidation bonus
- Reserve factor, usage as collateral enabled
- Borrow enabled, stable borrow enabled
- Is active, is frozen

---

#### 3. **Protocol Data Provider**

```
CONTRACT_PROTOCOLDATAPROVIDER=0x4135bA78F54aB5fF80eb9DE7d535293a319C99b7
```

**Purpose**: Detailed reserve and user data
**Use for**:

- Get reserve configuration
- Get reserve caps
- Get user reserve data
- Get aToken/debt token addresses

**Key Methods**:

```solidity
function getReserveConfigurationData(address asset) returns (decimals, ltv, liquidationThreshold, liquidationBonus, reserveFactor, usageAsCollateralEnabled, borrowingEnabled, stableBorrowRateEnabled, isActive, isFrozen)
function getReserveCaps(address asset) returns (borrowCap, supplyCap)
function getUserReserveData(address asset, address user) returns (currentATokenBalance, currentStableDebt, currentVariableDebt, principalStableDebt, scaledVariableDebt, stableBorrowRate, liquidityRate, stableRateLastUpdated, usageAsCollateralEnabled)
function getReserveTokensAddresses(address asset) returns (aTokenAddress, stableDebtTokenAddress, variableDebtTokenAddress)
```

---

#### 4. **Pool Addresses Provider**

```
CONTRACT_POOLADDRESSESPROVIDER=0xd0425D719be064a640868F8d4c7d0F8A70510913
```

**Purpose**: Registry of all protocol addresses
**Use for**:

- Get addresses of other protocol contracts dynamically
- Useful if contracts are upgraded

**Key Methods**:

```solidity
function getPool() returns (address)
function getPoolConfigurator() returns (address)
function getPriceOracle() returns (address)
function getACLManager() returns (address)
```

---

#### 5. **Creditify Oracle**

```
CONTRACT_CREDITIFYORACLE=0x0f659a3e35BC502BF67Bf119778c8936E9A7b84e
```

**Purpose**: Get asset prices
**Use for**:

- Display asset prices in USD
- Calculate collateral value
- Calculate borrow capacity

**Key Methods**:

```solidity
function getAssetPrice(address asset) returns (uint256)
function getAssetsPrices(address[] calldata assets) returns (uint256[] memory)
```

---

### Token Contracts

#### 6. **Asset Tokens**

```
TWETH=0x36c3461aa4Ad40153bbb666fCb4A94FBB81246f2
TUSDC=0xE899E6C96dD269E1ea613F0B95dCB6411A510eca
```

**Purpose**: Underlying assets users supply/borrow
**Use for**:

- Check user balance
- Approve spending for Pool contract
- Display token info

**Key Methods**:

```solidity
function balanceOf(address account) returns (uint256)
function approve(address spender, uint256 amount)
function allowance(address owner, address spender) returns (uint256)
```

---

#### 7. **aTokens (Interest-Bearing Tokens)**

```
WETH aToken: 0x09Fa3c5452Ad7da2B0041B2E92b1caDCA8aA15Fc
USDC aToken: 0xc87b0EF1327CBae802Eb8a65212B20628Ed84Ffc
```

**Purpose**: Represent supplied assets + accrued interest
**Use for**:

- Display user's supplied balance
- Show accrued interest
- Transfer aTokens (transfers underlying position)

**Key Methods**:

```solidity
function balanceOf(address user) returns (uint256) // Includes accrued interest
function scaledBalanceOf(address user) returns (uint256) // Normalized balance
```

---

#### 8. **Variable Debt Tokens**

```
WETH Variable Debt: 0xC47EEfAd9c7Fe28FB1829cA5ec731a88050AD788
USDC Variable Debt: 0xb05F802a093033bc13b3D85A00111E11315c1Ea5
```

**Purpose**: Represent borrowed amount + accrued interest
**Use for**:

- Display user's borrowed balance
- Show accrued interest on debt

**Key Methods**:

```solidity
function balanceOf(address user) returns (uint256) // Includes accrued interest
function scaledBalanceOf(address user) returns (uint256) // Normalized balance
```

---

### Helper Contracts

#### 9. **Wallet Balance Provider**

```
CONTRACT_WALLETBALANCEPROVIDER=0x55F14A53B0e595d6d8118dE6b14B5A4d92509AaB
```

**Purpose**: Batch fetch user balances
**Use for**:

- Get multiple token balances in one call
- Optimize frontend performance

**Key Methods**:

```solidity
function batchBalanceOf(address[] calldata users, address[] calldata tokens) returns (uint256[] memory)
function balanceOf(address user, address token) returns (uint256)
```

---

#### 10. **UI Incentive Data Provider**

```
CONTRACT_UIINCENTIVEDATAPROVIDER=0x69E15dF062F9C79F7eE0d377EBC9C12a34F059b5
```

**Purpose**: Get incentive/rewards data
**Use for**:

- Display reward APY
- Show claimable rewards
- Calculate total APY (interest + rewards)

---

## Frontend Architecture Recommendations

### Minimal Setup (Read-Only)

For displaying data only:

1. **UI Pool Data Provider** - Get all reserves and user data
2. **Pool** - Get specific reserve details
3. **Oracle** - Get asset prices

### Full Integration (Read + Write)

For complete functionality:

1. **Pool** - All user actions (supply, borrow, withdraw, repay)
2. **UI Pool Data Provider** - Display data
3. **Protocol Data Provider** - Detailed information
4. **Asset Tokens** - Approve spending
5. **Oracle** - Price data

---

## Example Frontend Flows

### 1. Display Dashboard

```javascript
// Get all reserves data
const reserves = await uiPoolDataProvider.getReservesData(
  poolAddressesProvider
);

// Get user data for all reserves
const userReserves = await uiPoolDataProvider.getUserReservesData(
  poolAddressesProvider,
  userAddress
);

// Get asset prices
const prices = await oracle.getAssetsPrices([TWETH, TUSDC]);

// Calculate totals
const totalSupplied = calculateTotalSupplied(userReserves, prices);
const totalBorrowed = calculateTotalBorrowed(userReserves, prices);
const healthFactor = calculateHealthFactor(userReserves);
```

### 2. Supply Asset

```javascript
// 1. Check allowance
const allowance = await assetToken.allowance(userAddress, poolAddress);

// 2. Approve if needed
if (allowance < amount) {
  await assetToken.approve(poolAddress, amount);
}

// 3. Supply to pool
await pool.supply(assetAddress, amount, userAddress, 0);
```

### 3. Borrow Asset

```javascript
// 1. Check borrow capacity
const userData = await pool.getUserAccountData(userAddress);
const availableToBorrow = userData.availableBorrowsBase;

// 2. Borrow (interestRateMode: 2 = variable)
await pool.borrow(assetAddress, amount, 2, 0, userAddress);
```

### 4. Get User Position

```javascript
// Get comprehensive user data
const accountData = await pool.getUserAccountData(userAddress);

// Returns:
// - totalCollateralBase: Total collateral in base currency
// - totalDebtBase: Total debt in base currency
// - availableBorrowsBase: Available to borrow in base currency
// - currentLiquidationThreshold: Weighted average liquidation threshold
// - ltv: Loan to value
// - healthFactor: Position health (< 1 = liquidatable)
```

---

## Contract ABIs

You'll need ABIs for:

1. **IPool** - Main protocol interface
2. **IUiPoolDataProviderV3** - UI data aggregator
3. **IPoolDataProvider** - Detailed data provider
4. **ICreditifyOracle** - Price oracle
5. **IERC20** - Token standard (for assets)
6. **IAToken** - Interest-bearing token interface (includes balanceOf, scaledBalanceOf)
7. **IVariableDebtToken** - Debt token interface
8. **WalletBalanceProvider** - Batch balance queries

### ABI Locations

**Compiled ABIs (JSON format):**

- `out/IPool.sol/IPool.json`
- `out/IUiPoolDataProviderV3.sol/IUiPoolDataProviderV3.json`
- `out/IPoolDataProvider.sol/IPoolDataProvider.json`
- `out/ICreditifyOracle.sol/ICreditifyOracle.json`
- `out/IERC20.sol/IERC20.json`
- `out/IAToken.sol/IAToken.json`
- `out/IVariableDebtToken.sol/IVariableDebtToken.json`
- `out/WalletBalanceProvider.sol/WalletBalanceProvider.json`
- `out/IUiIncentiveDataProviderV3.sol/IUiIncentiveDataProviderV3.json`

**Source Interfaces:**

- `src/contracts/interfaces/IPool.sol`
- `src/contracts/helpers/interfaces/IUiPoolDataProviderV3.sol`
- `src/contracts/interfaces/IPoolDataProvider.sol`
- `src/contracts/interfaces/ICreditifyOracle.sol`

---

## Quick Reference: Contract Addresses

```javascript
// Copy this to your frontend config
export const CREDITIFY_CONTRACTS = {
  // Core
  pool: "0x35d4c4c4ca208F50330edD0Bb1592be7e29bE861",
  poolAddressesProvider: "0xd0425D719be064a640868F8d4c7d0F8A70510913",

  // Data Providers
  uiPoolDataProvider: "0x547593068Df1496C7dE4fcabE64E1B214B26Ab77",
  protocolDataProvider: "0x4135bA78F54aB5fF80eb9DE7d535293a319C99b7",
  walletBalanceProvider: "0x55F14A53B0e595d6d8118dE6b14B5A4d92509AaB",

  // Oracle
  oracle: "0x0f659a3e35BC502BF67Bf119778c8936E9A7b84e",

  // Assets
  assets: {
    WETH: "0x36c3461aa4Ad40153bbb666fCb4A94FBB81246f2",
    USDC: "0xE899E6C96dD269E1ea613F0B95dCB6411A510eca",
  },

  // aTokens
  aTokens: {
    aWETH: "0x09Fa3c5452Ad7da2B0041B2E92b1caDCA8aA15Fc",
    aUSDC: "0xc87b0EF1327CBae802Eb8a65212B20628Ed84Ffc",
  },

  // Debt Tokens
  debtTokens: {
    variableDebtWETH: "0xC47EEfAd9c7Fe28FB1829cA5ec731a88050AD788",
    variableDebtUSDC: "0xb05F802a093033bc13b3D85A00111E11315c1Ea5",
  },
};

export const NETWORK = {
  name: "XDC Apothem Testnet",
  chainId: 51,
  rpc: "https://erpc.apothem.network",
};
```

---

## Verified ABI Methods

### IPool (Main Contract)

✅ Verified methods available:

- `supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)`
- `withdraw(address asset, uint256 amount, address to) returns (uint256)`
- `borrow(address asset, uint256 amount, uint256 interestRateMode, uint16 referralCode, address onBehalfOf)`
- `repay(address asset, uint256 amount, uint256 interestRateMode, address onBehalfOf) returns (uint256)`
- `getUserAccountData(address user) returns (uint256 totalCollateralBase, uint256 totalDebtBase, uint256 availableBorrowsBase, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)`
- `getReserveData(address asset) returns (DataTypes.ReserveDataLegacy)`
- `setUserUseReserveAsCollateral(address asset, bool useAsCollateral)`
- `liquidationCall(address collateralAsset, address debtAsset, address borrower, uint256 debtToCover, bool receiveAToken)`

### IUiPoolDataProviderV3

✅ Verified methods available:

- `getReservesData(IPoolAddressesProvider provider) returns (AggregatedReserveData[], BaseCurrencyInfo)`
- `getUserReservesData(IPoolAddressesProvider provider, address user) returns (UserReserveData[], uint8)`
- `getReservesList(IPoolAddressesProvider provider) returns (address[])`

### IPoolDataProvider (Protocol Data Provider)

✅ Verified methods available:

- `getReserveConfigurationData(address asset) returns (uint256 decimals, uint256 ltv, uint256 liquidationThreshold, uint256 liquidationBonus, uint256 reserveFactor, bool usageAsCollateralEnabled, bool borrowingEnabled, bool stableBorrowRateEnabled, bool isActive, bool isFrozen)`
- `getReserveCaps(address asset) returns (uint256 borrowCap, uint256 supplyCap)`
- `getUserReserveData(address asset, address user) returns (uint256 currentATokenBalance, uint256 currentStableDebt, uint256 currentVariableDebt, uint256 principalStableDebt, uint256 scaledVariableDebt, uint256 stableBorrowRate, uint256 liquidityRate, uint40 stableRateLastUpdated, bool usageAsCollateralEnabled)`
- `getReserveTokensAddresses(address asset) returns (address aTokenAddress, address stableDebtTokenAddress, address variableDebtTokenAddress)`
- `getReserveDeficit(address asset) returns (uint256)`
- `getVirtualUnderlyingBalance(address asset) returns (uint256)`

### ICreditifyOracle

✅ Verified methods available:

- `getAssetPrice(address asset) returns (uint256)`
- `getAssetsPrices(address[] assets) returns (uint256[])`
- `getSourceOfAsset(address asset) returns (address)`
- `getFallbackOracle() returns (address)`

### IERC20 (Asset Tokens)

✅ Verified methods available:

- `balanceOf(address account) returns (uint256)`
- `approve(address spender, uint256 amount) returns (bool)`
- `allowance(address owner, address spender) returns (uint256)`
- `transfer(address to, uint256 amount) returns (bool)`
- `transferFrom(address from, address to, uint256 amount) returns (bool)`

### IAToken (Interest-Bearing Tokens)

✅ Verified methods available:

- `balanceOf(address user) returns (uint256)` - Includes accrued interest
- `scaledBalanceOf(address user) returns (uint256)` - Normalized balance
- `getScaledUserBalanceAndSupply(address user) returns (uint256, uint256)`
- `UNDERLYING_ASSET_ADDRESS() returns (address)`
- `approve(address spender, uint256 amount) returns (bool)`
- `transfer(address to, uint256 amount) returns (bool)`

### WalletBalanceProvider

✅ Verified methods available:

- `balanceOf(address user, address token) returns (uint256)`
- `batchBalanceOf(address[] users, address[] tokens) returns (uint256[])`
- `getUserWalletBalances(address provider, address user) returns (address[], uint256[])`

---

## Testing Your Integration

Use these test accounts/amounts:

- **Supply**: 1 WETH or 1000 USDC
- **Borrow**: Up to 80% of collateral value for WETH, 75% for USDC
- **Health Factor**: Should stay above 1.0 to avoid liquidation

Monitor:

- Interest accrual (updates every block)
- Health factor changes
- Available borrow capacity

---

## Support & Resources

- **Aave V3 Docs**: https://docs.aave.com/developers/
- **Contract Interfaces**: `src/contracts/interfaces/`
- **Example Scripts**: `scripts/setup/` and `scripts/queries/`

Your protocol is fully compatible with Aave V3 frontend libraries and SDKs! 🚀
