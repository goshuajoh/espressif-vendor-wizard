/**
 * Langchao API Service
 * Calls the local Python backend which handles the Langchao API communication
 */

// Local Python backend URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

/**
 * API Response interface
 */
export interface LangchaoApiResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Create a customer via the local Python backend
 * The backend handles all Langchao API authentication and communication
 *
 * @param customerData - Customer data object to create
 * @returns API response with success status and data/error
 */
export async function createCustomer(customerData: object | object[]): Promise<LangchaoApiResponse> {
  const url = `${BACKEND_URL}/api/create-customer`;

  console.log('[Backend API] Creating customer via Python backend:', {
    url,
    customerData,
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });

    const result = await response.json();

    console.log('[Backend API] Response:', result);

    if (result.success) {
      return {
        success: true,
        message: result.message,
        data: result.data,
      };
    } else {
      return {
        success: false,
        error: {
          code: result.error || 'API_ERROR',
          message: result.message || 'Unknown error',
        },
      };
    }
  } catch (error) {
    console.error('[Backend API] Request failed:', error);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Failed to connect to backend server',
      },
    };
  }
}

/**
 * Check if the backend is available
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`);
    const data = await response.json();
    return data.status === 'ok';
  } catch {
    return false;
  }
}

/**
 * Check if API is configured (backend is running)
 * Always returns true since backend handles configuration
 */
export function isApiConfigured(): boolean {
  return true;
}

/**
 * Get backend URL for debugging
 */
export function getApiConfig() {
  return {
    backendUrl: BACKEND_URL,
  };
}
