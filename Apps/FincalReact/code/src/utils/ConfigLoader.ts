export interface Env {
  VITE_API_BASE_URL: string;
  VITE_API_CALCULATE_RETIREMENT: string;
  VITE_API_CALCULATE_REDUCE: string;
  VITE_API_CALCULATE_SAVING_TAXREDUCE: string;
  VITE_SUBSCRIPTION_KEY: string;
  VITE_SAVING_TOOLS_CALCULATION_API: string;
  VITE_INFLATION_API_BASE_URL: string;
  VITE_INFLATION_API_PATH: string;
  VITE_RETIRED_PLAN_TEXTS_JSON_PATH: string;
  VITE_TAX_SAVINGS_PLAN_TEXTS_JSON_PATH: string;
  VITE_SAVING_TOOLS_TEXTS_JSON_PATH: string;
}
let cachedEnv: Env | null = null;
let fetchEnvPromise: Promise<Env> | null = null;

export const fetchEnv = async (): Promise<Env> => {
  if (cachedEnv) {
    return cachedEnv;
  }

  if (fetchEnvPromise) {
    return fetchEnvPromise;
  }

  fetchEnvPromise = (async () => {
    try {
      const response = await fetch('/MobileServices/FinCal/env.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} from /MobileServices/FinCal/env.json`);
      }
      const data: { env: Env } = await response.json();
      cachedEnv = data.env;
      return cachedEnv;
    } catch (error) {
      console.error("Failed to load retirement config:", error);
      throw error;
    } finally {
      fetchEnvPromise = null;
    }
  })();

  return fetchEnvPromise;
};