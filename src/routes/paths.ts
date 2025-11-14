/**
 * Centralized route paths for the application
 * Use these constants instead of hardcoded strings for type safety
 */

export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  HISTORY: "/history",
  ASSET_DETAILS: "/asset-details",
  MARKET: "/market",
  GOVERNANCE: "/governance",
  SAVINGS: "/savings",
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];

/**
 * Helper function to build asset details route with query params
 */
export const buildAssetDetailsRoute = (tokenSymbol: string): string => {
  return `${ROUTES.ASSET_DETAILS}?token=${tokenSymbol}`;
};
