/**
 * URL Parameter utilities for the Vendor Wizard
 * 
 * Supported URL parameters:
 * - businessSupport / bs: Name of the Business Support member who sent the link
 * 
 * Example URLs:
 * https://your-domain.com/?businessSupport=王娜娜
 * https://your-domain.com/?bs=John%20Doe
 */

export interface UrlParams {
  businessSupport?: string;
}

/**
 * Parse URL parameters from the current window location
 */
export function getUrlParams(): UrlParams {
  const searchParams = new URLSearchParams(window.location.search);
  
  return {
    businessSupport: searchParams.get('businessSupport') || searchParams.get('bs') || undefined,
  };
}

/**
 * Generate a shareable URL with Business Support name
 * 
 * @example
 * // Generate URL for Business Support "王娜娜"
 * generateShareableUrl('王娜娜')
 * // Returns: https://your-domain.com/?bs=王娜娜
 */
export function generateShareableUrl(businessSupport: string): string {
  const baseUrl = window.location.origin + window.location.pathname;
  const searchParams = new URLSearchParams();
  
  if (businessSupport) {
    searchParams.set('bs', businessSupport);
  }
  
  const queryString = searchParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Copy URL to clipboard
 */
export async function copyUrlToClipboard(url: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = url;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  }
}
