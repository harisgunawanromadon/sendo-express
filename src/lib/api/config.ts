// Configuration for API services

const isDevelopment = import.meta.env.DEV;

export const API_CONFIG = {
  baseURL: isDevelopment
    ? import.meta.env.VITE_API_DEV_BASE_URL
    : import.meta.env.VITE_API_BASE_URL,

  timeout: 10000,
  retries: 3,
} as const;

export const MOCK_CONFIG = {
  enabled: false,
  delay: {
    min: 300,
    max: 1000,
  },
} as const;

export const getApiConfig = () => ({
  ...API_CONFIG,
  environment: isDevelopment ? "development" : "production",
  mockMode: isDevelopment && MOCK_CONFIG.enabled,
});
