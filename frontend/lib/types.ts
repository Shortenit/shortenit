export interface Url {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clickCount: number;
  createdAt: string;
  customAlias?: string;
  title: string;
  isActive?: boolean;
  owner?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface PaginatedLinksResponse {
  content: Array<Url>;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface LinkDetails {
  id: number;
  originalUrl: string;
  code: string;
  shortUrl: string;
  title: string;
  clickCount: number;
  createdAt: string;
  expiresAt: string | null;
  isActive: boolean;
  codeType: string;
  owner: {
    id: number;
    name: string;
    email: string;
  };
}

export interface AnalyticsData {
    code: string;
    originalUrl: string;
    totalClicks: number;
    createdAt: string;
    clicksByDate: Record<string, number>;
    clicksByHour: Record<string, number>;
    topCountries: Array<{ country: string; clicks: number; percentage: number }>;
    topCities: Array<{ city: string; country: string; clicks: number; percentage: number }>;
    deviceStats: {
        mobile: number;
        desktop: number;
        tablet: number;
        unknown: number;
        mobilePercentage: number;
        desktopPercentage: number;
        tabletPercentage: number;
    };
    topBrowsers: Array<{ browser: string; clicks: number; percentage: number }>;
    topReferrers: Array<any>;
    recentClicks: Array<{
        timestamp: string;
        country: string;
        city: string;
        deviceType: string;
        browser: string;
        referrer: string | null;
    }>;
}

export type Role = "USER" | "ADMIN";

export interface User {
  id: number;
  email: string;
  name?: string;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
}
