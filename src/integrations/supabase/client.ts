// Supabase integration removed.
// This module kept as a compatibility shim to avoid failing imports in places
// that still reference the old path. All calls will throw a clear error
// indicating Supabase has been removed and pointing to the new services.

const errorFn = (prop: string | symbol) => () => {
  throw new Error(`Supabase client removed. Tried to access: ${String(prop)}. Use the backend services in /src/services instead.`);
};

// Export a proxy that throws when used to help locate remaining usages.
export const supabase = new Proxy({}, {
  get: (_t, prop) => errorFn(prop),
  apply: (_t, _thisArg, _args) => {
    throw new Error('Supabase client removed. Use backend services.');
  }
});