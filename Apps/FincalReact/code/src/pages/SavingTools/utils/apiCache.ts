import { fetchSavingToolsInitialRates } from './savingToolsApi';
import { SavingToolsInitialRates } from '../types';

let cachedInitialRates: SavingToolsInitialRates | null = null;
let fetchPromise: Promise<SavingToolsInitialRates | null> | null = null;

export async function getCachedSavingToolsInitialRates(): Promise<SavingToolsInitialRates | null> {
  if (cachedInitialRates) {
    console.log("Using cached initial rates.");
    return cachedInitialRates;
  }

  if (fetchPromise) {
    console.log("Initial rates fetch already in progress, awaiting promise.");
    return fetchPromise;
  }

  console.log("Fetching initial rates for the first time.");
  fetchPromise = fetchSavingToolsInitialRates();
  cachedInitialRates = await fetchPromise;
  fetchPromise = null; // Clear the promise after it resolves
  return cachedInitialRates;
}