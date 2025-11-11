#!/usr/bin/env node
/**
 * Script to extract environment variables and update chain configuration
 * Usage: npm run update-config
 * or: node scripts/update-config-from-env.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse .env file
function parseEnvFile(filePath) {
  const envContent = fs.readFileSync(filePath, "utf-8");
  const envVars = {};

  envContent.split("\n").forEach((line) => {
    // Skip comments and empty lines
    if (line.trim().startsWith("#") || !line.trim()) {
      return;
    }

    const [key, ...valueParts] = line.split("=");
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join("=").trim();
    }
  });

  return envVars;
}

// Generate TypeScript config file
function generateChainConfig(envVars) {
  const poolProxy = envVars.CONTRACT_POOLPROXY || "";
  const poolAddressesProvider = envVars.CONTRACT_POOLADDRESSESPROVIDER || "";
  const uiPoolDataProvider = envVars.CONTRACT_UIPOOLDATAPROVIDER || "";
  const protocolDataProvider = envVars.CONTRACT_PROTOCOLDATAPROVIDER || "";
  const walletBalanceProvider = envVars.CONTRACT_WALLETBALANCEPROVIDER || "";
  const oracle = envVars.CONTRACT_CREDITIFYORACLE || "";
  const wrappedTokenGateway = envVars.CONTRACT_WRAPPEDTOKENGATEWAY || "";
  const uiIncentiveDataProvider =
    envVars.CONTRACT_UIINCENTIVEDATAPROVIDER || "";

  const wxdcAddress = envVars.WXDC_APOTHEM || "";
  const usdcAddress = envVars.USDC_APOTHEM || "";
  const cgoAddress = envVars.CGO_APOTHEM || "";

  return `import { xdc, xdcTestnet } from "wagmi/chains";
import { getChainLogo } from "./tokenLogos";

export interface ChainConfig {
  contracts: {
    pool: \`0x\${string}\`;
    poolAddressesProvider: \`0x\${string}\`;
    uiPoolDataProvider: \`0x\${string}\`;
    protocolDataProvider: \`0x\${string}\`;
    walletBalanceProvider: \`0x\${string}\`;
    oracle: \`0x\${string}\`;
    wrappedTokenGateway: \`0x\${string}\`;
    uiIncentiveDataProvider?: \`0x\${string}\`;
  };
  tokens: {
    // Wrapped native token (WXDC on XDC, WXDC on Ethereum, etc.)
    wrappedNative: {
      address: \`0x\${string}\`;
      symbol: string;
      decimals: number;
      aToken: \`0x\${string}\`;
      variableDebtToken: \`0x\${string}\`;
    };
    usdc: {
      address: \`0x\${string}\`;
      symbol: string;
      decimals: number;
      aToken: \`0x\${string}\`;
      variableDebtToken: \`0x\${string}\`;
    };
    cgo: {
      address: \`0x\${string}\`;
      symbol: string;
      decimals: number;
      aToken: \`0x\${string}\`;
      variableDebtToken: \`0x\${string}\`;
    };
  };
  network: {
    name: string;
    chainId: number;
    icon: string;
    nativeToken: {
      symbol: string;
      name: string;
      decimals: number;
    };
  };
}

export const CHAIN_CONFIGS: Record<number, ChainConfig> = {
  // XDC Mainnet
  [xdc.id]: {
    contracts: {
      pool: "0x35d4c4c4ca208F50330edD0Bb1592be7e29bE861",
      poolAddressesProvider: "0xd0425D719be064a640868F8d4c7d0F8A70510913",
      uiPoolDataProvider: "0x547593068Df1496C7dE4fcabE64E1B214B26Ab77",
      protocolDataProvider: "0x4135bA78F54aB5fF80eb9DE7d535293a319C99b7",
      walletBalanceProvider: "0x55F14A53B0e595d6d8118dE6b14B5A4d92509AaB",
      oracle: "0x0f659a3e35BC502BF67Bf119778c8936E9A7b84e",
      wrappedTokenGateway: "0x0000000000000000000000000000000000000000", // TODO: Add mainnet address
      uiIncentiveDataProvider: "0x69E15dF062F9C79F7eE0d377EBC9C12a34F059b5",
    },
    tokens: {
      wrappedNative: {
        address: "0x951857744785E80e2De051c32EE7b25f9c458C42", // WXDC on mainnet
        symbol: "WXDC",
        decimals: 18,
        aToken: "0x09Fa3c5452Ad7da2B0041B2E92b1caDCA8aA15Fc",
        variableDebtToken: "0xC47EEfAd9c7Fe28FB1829cA5ec731a88050AD788",
      },
      usdc: {
        address: "0xE899E6C96dD269E1ea613F0B95dCB6411A510eca",
        symbol: "USDC",
        decimals: 6,
        aToken: "0xc87b0EF1327CBae802Eb8a65212B20628Ed84Ffc",
        variableDebtToken: "0xb05F802a093033bc13b3D85A00111E11315c1Ea5",
      },
      cgo: {
        address: "0x0000000000000000000000000000000000000000", // TODO: Add mainnet address
        symbol: "CGO",
        decimals: 18,
        aToken: "0x0000000000000000000000000000000000000000",
        variableDebtToken: "0x0000000000000000000000000000000000000000",
      },
    },
    network: {
      name: "XDC Mainnet",
      chainId: 50,
      icon: getChainLogo(50),
      nativeToken: {
        symbol: "XDC",
        name: "XDC Network",
        decimals: 18,
      },
    },
  },
  // XDC Apothem Testnet (Auto-generated from .env)
  [xdcTestnet.id]: {
    contracts: {
      pool: "${poolProxy}",
      poolAddressesProvider: "${poolAddressesProvider}",
      uiPoolDataProvider: "${uiPoolDataProvider}",
      protocolDataProvider: "${protocolDataProvider}",
      walletBalanceProvider: "${walletBalanceProvider}",
      oracle: "${oracle}",
      wrappedTokenGateway: "${wrappedTokenGateway}",
      uiIncentiveDataProvider: "${uiIncentiveDataProvider}",
    },
    tokens: {
      wrappedNative: {
        address: "${wxdcAddress}", // WXDC on testnet
        symbol: "WXDC",
        decimals: 18,
        aToken: "0x09Fa3c5452Ad7da2B0041B2E92b1caDCA8aA15Fc",
        variableDebtToken: "0xC47EEfAd9c7Fe28FB1829cA5ec731a88050AD788",
      },
      usdc: {
        address: "${usdcAddress}",
        symbol: "USDC",
        decimals: 6,
        aToken: "0xc87b0EF1327CBae802Eb8a65212B20628Ed84Ffc",
        variableDebtToken: "0xb05F802a093033bc13b3D85A00111E11315c1Ea5",
      },
      cgo: {
        address: "${cgoAddress}",
        symbol: "CGO",
        decimals: 18,
        aToken: "0x0000000000000000000000000000000000000000",
        variableDebtToken: "0x0000000000000000000000000000000000000000",
      },
    },
    network: {
      name: "XDC Apothem",
      chainId: 51,
      icon: getChainLogo(51),
      nativeToken: {
        symbol: "XDC",
        name: "XDC Network",
        decimals: 18,
      },
    },
  },
};

export const getChainConfig = (chainId: number | undefined): ChainConfig => {
  if (!chainId || !CHAIN_CONFIGS[chainId]) {
    // Default to XDC Apothem
    return CHAIN_CONFIGS[xdcTestnet.id];
  }
  return CHAIN_CONFIGS[chainId];
};
`;
}

// Main execution
function main() {
  console.log("🔄 Updating chain configuration from .env file...\n");

  const rootDir = path.join(__dirname, "..");
  const envPath = path.join(rootDir, ".env");
  const configPath = path.join(rootDir, "src/config/chains.ts");

  // Check if .env exists
  if (!fs.existsSync(envPath)) {
    console.error("❌ Error: .env file not found!");
    process.exit(1);
  }

  // Parse environment variables
  console.log("📖 Reading .env file...");
  const envVars = parseEnvFile(envPath);

  // Validate required variables
  const requiredVars = [
    "CONTRACT_POOLPROXY",
    "CONTRACT_POOLADDRESSESPROVIDER",
    "CONTRACT_UIPOOLDATAPROVIDER",
    "CONTRACT_PROTOCOLDATAPROVIDER",
    "CONTRACT_WALLETBALANCEPROVIDER",
    "CONTRACT_CREDITIFYORACLE",
    "WXDC_APOTHEM",
    "USDC_APOTHEM",
  ];

  const missingVars = requiredVars.filter((varName) => !envVars[varName]);
  if (missingVars.length > 0) {
    console.error("❌ Error: Missing required environment variables:");
    missingVars.forEach((varName) => console.error(`   - ${varName}`));
    process.exit(1);
  }

  // Generate new config
  console.log("⚙️  Generating configuration...");
  const newConfig = generateChainConfig(envVars);

  // Backup existing config
  if (fs.existsSync(configPath)) {
    const backupPath = `${configPath}.backup`;
    fs.copyFileSync(configPath, backupPath);
    console.log(`💾 Backed up existing config to ${backupPath}`);
  }

  // Write new config
  fs.writeFileSync(configPath, newConfig, "utf-8");
  console.log(`✅ Updated ${configPath}`);

  // Display summary
  console.log("\n📋 Configuration Summary:");
  console.log(`   Pool: ${envVars.CONTRACT_POOLPROXY}`);
  console.log(`   Oracle: ${envVars.CONTRACT_CREDITIFYORACLE}`);
  console.log(`   WXDC: ${envVars.WXDC_APOTHEM}`);
  console.log(`   USDC: ${envVars.USDC_APOTHEM}`);
  console.log(`   CGO: ${envVars.CGO_APOTHEM || "Not set"}`);
  console.log(
    `   Gateway: ${envVars.CONTRACT_WRAPPEDTOKENGATEWAY || "Not set"}`
  );

  console.log("\n✨ Configuration updated successfully!");
}

// Run the script
main();
