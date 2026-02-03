/**
 * Country Lookup Service
 * Fetches country information and provides Chinese country names
 */

// REST Countries API - free, no auth required
const REST_COUNTRIES_API = 'https://restcountries.com/v3.1';

// Cache for country data to avoid repeated API calls
let countryCache: CountryData[] | null = null;

interface CountryData {
  name: {
    common: string;
    official: string;
    nativeName?: Record<string, { official: string; common: string }>;
  };
  translations: Record<string, { official: string; common: string }>;
  cca2: string; // ISO 3166-1 alpha-2 code (e.g., "US", "CN")
  cca3: string; // ISO 3166-1 alpha-3 code (e.g., "USA", "CHN")
}

/**
 * Fetch all countries from REST Countries API
 */
async function fetchAllCountries(): Promise<CountryData[]> {
  if (countryCache) {
    return countryCache;
  }

  try {
    const response = await fetch(
      `${REST_COUNTRIES_API}/all?fields=name,translations,cca2,cca3`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch countries: ${response.status}`);
    }

    countryCache = await response.json();
    return countryCache!;
  } catch (error) {
    console.error('[CountryService] Failed to fetch countries:', error);
    return [];
  }
}

/**
 * Get Chinese name for a country
 * @param countryIdentifier - Can be English name, ISO code (2 or 3 letter), or partial match
 * @returns Chinese name or original identifier if not found
 */
export async function getChineseCountryName(countryIdentifier: string): Promise<string> {
  if (!countryIdentifier) return '';

  const identifier = countryIdentifier.trim().toLowerCase();
  const countries = await fetchAllCountries();

  if (countries.length === 0) {
    // Fallback to local mapping if API fails
    return getLocalChineseCountryName(countryIdentifier);
  }

  // Find matching country
  const country = countries.find(c => {
    // Check ISO codes
    if (c.cca2.toLowerCase() === identifier || c.cca3.toLowerCase() === identifier) {
      return true;
    }
    // Check English names (common and official)
    if (c.name.common.toLowerCase() === identifier ||
        c.name.official.toLowerCase() === identifier) {
      return true;
    }
    // Partial match on common name
    if (c.name.common.toLowerCase().includes(identifier) ||
        identifier.includes(c.name.common.toLowerCase())) {
      return true;
    }
    return false;
  });

  if (country && country.translations.zho) {
    return country.translations.zho.common || country.translations.zho.official;
  }

  // Fallback to local mapping
  return getLocalChineseCountryName(countryIdentifier);
}

/**
 * Extract country from address and get Chinese name
 * Tries to identify country from address text
 */
export async function getChineseCountryFromAddress(address: string): Promise<string> {
  if (!address) return '中国'; // Default to China

  const addressLower = address.toLowerCase();
  const countries = await fetchAllCountries();

  // If address contains Chinese characters, likely China
  if (/[\u4e00-\u9fa5]/.test(address)) {
    // But check if it explicitly mentions another country
    const nonChinaMatch = countries.find(c => {
      const zhName = c.translations.zho?.common || '';
      return zhName && address.includes(zhName) && zhName !== '中国';
    });
    if (nonChinaMatch && nonChinaMatch.translations.zho) {
      return nonChinaMatch.translations.zho.common;
    }
    return '中国';
  }

  // Search for country names in the address
  for (const country of countries) {
    const commonName = country.name.common.toLowerCase();
    const officialName = country.name.official.toLowerCase();
    const cca2 = country.cca2.toLowerCase();
    const cca3 = country.cca3.toLowerCase();

    // Check if address contains country name or code
    // Use word boundaries to avoid false matches
    const patterns = [
      new RegExp(`\\b${commonName}\\b`, 'i'),
      new RegExp(`\\b${officialName}\\b`, 'i'),
      new RegExp(`\\b${cca2}\\b`, 'i'),
      new RegExp(`\\b${cca3}\\b`, 'i'),
    ];

    for (const pattern of patterns) {
      if (pattern.test(address)) {
        if (country.translations.zho) {
          return country.translations.zho.common || country.translations.zho.official;
        }
        return country.name.common; // Fallback to English if no Chinese translation
      }
    }
  }

  // Common abbreviations and variations not in standard data
  const specialCases: Record<string, string> = {
    'usa': '美国',
    'u.s.a': '美国',
    'u.s.': '美国',
    'uk': '英国',
    'u.k.': '英国',
    'uae': '阿联酋',
    'hk': '香港',
    'tw': '台湾',
    'sg': '新加坡',
  };

  for (const [abbr, zhName] of Object.entries(specialCases)) {
    if (addressLower.includes(abbr)) {
      return zhName;
    }
  }

  // No country detected - return empty to prompt user
  return '';
}

/**
 * Get list of all countries with their Chinese names
 * Useful for country selection dropdowns
 */
export async function getAllCountriesWithChineseNames(): Promise<Array<{
  code: string;
  englishName: string;
  chineseName: string;
}>> {
  const countries = await fetchAllCountries();

  return countries
    .map(c => ({
      code: c.cca2,
      englishName: c.name.common,
      chineseName: c.translations.zho?.common || c.name.common,
    }))
    .sort((a, b) => a.englishName.localeCompare(b.englishName));
}

/**
 * Local fallback mapping for common countries
 * Used when API is unavailable
 */
function getLocalChineseCountryName(identifier: string): string {
  const localMap: Record<string, string> = {
    // Common English names
    'china': '中国',
    'singapore': '新加坡',
    'japan': '日本',
    'korea': '韩国',
    'south korea': '韩国',
    'taiwan': '台湾',
    'hong kong': '香港',
    'india': '印度',
    'malaysia': '马来西亚',
    'thailand': '泰国',
    'vietnam': '越南',
    'indonesia': '印度尼西亚',
    'philippines': '菲律宾',
    'germany': '德国',
    'france': '法国',
    'united kingdom': '英国',
    'italy': '意大利',
    'spain': '西班牙',
    'netherlands': '荷兰',
    'poland': '波兰',
    'sweden': '瑞典',
    'switzerland': '瑞士',
    'united states': '美国',
    'united states of america': '美国',
    'canada': '加拿大',
    'brazil': '巴西',
    'mexico': '墨西哥',
    'australia': '澳大利亚',
    'new zealand': '新西兰',
    'israel': '以色列',
    'united arab emirates': '阿联酋',
    // ISO codes
    'cn': '中国',
    'sg': '新加坡',
    'jp': '日本',
    'kr': '韩国',
    'tw': '台湾',
    'hk': '香港',
    'in': '印度',
    'my': '马来西亚',
    'th': '泰国',
    'vn': '越南',
    'id': '印度尼西亚',
    'ph': '菲律宾',
    'de': '德国',
    'fr': '法国',
    'gb': '英国',
    'uk': '英国',
    'it': '意大利',
    'es': '西班牙',
    'nl': '荷兰',
    'pl': '波兰',
    'se': '瑞典',
    'ch': '瑞士',
    'us': '美国',
    'usa': '美国',
    'ca': '加拿大',
    'br': '巴西',
    'mx': '墨西哥',
    'au': '澳大利亚',
    'nz': '新西兰',
    'il': '以色列',
    'ae': '阿联酋',
    'uae': '阿联酋',
  };

  const key = identifier.toLowerCase().trim();
  return localMap[key] || identifier;
}

/**
 * Preload country data (call on app init for better UX)
 */
export async function preloadCountryData(): Promise<void> {
  await fetchAllCountries();
}
