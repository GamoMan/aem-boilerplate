import { TaxCalculationResult } from "../types";
import { fetchEnv } from "../../../utils/ConfigLoader";

let API_BASE_URL: string;
let API_KEY: string;

(async () => {
  const env = await fetchEnv();
  API_BASE_URL = env.VITE_API_BASE_URL;
  API_KEY = env.VITE_SUBSCRIPTION_KEY;
})();

interface CalculateReducePayload {
  Income: number;
  OtherIncome: number;
  Bonus: number;
  ProvidentFund: number;
  NumberOfChildeBornBefore61: number;
  NumberOfChildeBorn61OnWards: number;
  FatherMother: number;
  HomeInterest: number;
  FatherInsure: number;
  Insure: number;
  PensionInsure: number;
  HealthInsure: number;
  ReduceSSF: number;
  ReduceRMF: number;
  ReduceESG: number;
  Donate: number;
  Other: number;
}


export const fetchInitialMaxValues = async (payload: CalculateReducePayload): Promise<Partial<TaxCalculationResult>> => {
  const env = await fetchEnv();
  const API_CALCULATE_REDUCE = env.VITE_API_CALCULATE_REDUCE;
  const response = await fetch(`${API_BASE_URL}${API_CALCULATE_REDUCE}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ocp-apim-subscription-key': API_KEY,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const fetchTaxCalculationResult = async (payload: CalculateReducePayload): Promise<TaxCalculationResult> => {
  const env = await fetchEnv();
  const API_CALCULATE_SAVING_TAXREDUCE = env.VITE_API_CALCULATE_SAVING_TAXREDUCE;
  const response = await fetch(`${API_BASE_URL}${API_CALCULATE_SAVING_TAXREDUCE}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ocp-apim-subscription-key': API_KEY,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};