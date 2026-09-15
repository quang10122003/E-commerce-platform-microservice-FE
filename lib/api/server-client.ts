/**
 * Entry point công khai re-export các hàm, types và endpoint list cho Server Components và Route Handlers.
 */
export {
  serverFetch,
  buildAuthHeaders,
  fetchWithTimeout,
  getBackendUrl,
  getEndpointPath,
  parseApiResponse,
} from "@/lib/api/server-fetch";
export type {
  ServerFetchOptions,
  ServerFetchRequestContext,
  ServerFetchResult,
  ServerFetchUnauthorizedContext,
} from "@/lib/api/server-fetch";
export {
  isPublicEndpoint,
  PUBLIC_ENDPOINTS,
  AUTH_ENDPOINTS,
  AUTH_TOKEN_FIELDS,
  AUTHORIZATION_HEADER,
} from "@/lib/api/public-endpoints";
