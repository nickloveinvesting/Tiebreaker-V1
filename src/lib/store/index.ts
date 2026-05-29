import { LocalStorageStore } from './LocalStorageStore';
import { DataStore } from './DataStore';

// In Phase 2, this can conditionally export a SupabaseStore based on env vars
export const store: DataStore = new LocalStorageStore();

// Export the concrete class for seed access since 'store' is typed as DataStore
export const storeInstance = store as LocalStorageStore;
