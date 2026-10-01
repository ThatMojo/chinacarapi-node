export interface CatalogParams {
  source?: "dongchedi" | "che168" | string;
  duplicates?: "include";
  make?: string | number;
  model?: string | number;
  year_min?: number; year_max?: number;
  reg_year_min?: number; reg_year_max?: number;
  price_min?: number; price_max?: number;
  mileage_max?: number;
  city?: string; fuel?: string;
  has_report?: boolean; export_ready?: boolean;
  updated_since?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "mileage_asc" | "year_desc";
  page?: number; limit?: number;
  lang?: "zh";
}
export interface Money { cny: number; usd: number; eur: number }
export interface Named { id: number | null; name: string | null; nameZh: string | null }
export interface VehicleSummary {
  id: string; source: "dongchedi" | "che168"; title: string;
  make: Named; model: Named; trim: Named;
  modelYear: number | null; firstRegistration: string | null; mileageKm: number | null;
  price: Money | null; city: string | null; fuel: string | null; transmission: string | null;
  hasInspectionReport: boolean | null; inspectionAvailable: boolean;
  image: string | null; url: string;
  alsoListedOn: { source: string; id: string; url: string }[];
  status: "active" | "removed"; firstSeenAt: string; updatedAt: string;
  [key: string]: unknown;
}
export interface CatalogResponse { total: number; page: number; limit: number; sort: string; results: VehicleSummary[] }
export declare class ChinaCarAPIError extends Error { status?: number; body?: string }
export declare class ChinaCarAPI {
  constructor(apiKey?: string, options?: { baseUrl?: string });
  catalog(params?: CatalogParams): Promise<CatalogResponse>;
  vehicle(id: string, params?: { source?: string; lang?: "zh"; raw?: "1" }): Promise<VehicleSummary>;
  inspection(id: string, params?: { source?: string; lang?: "zh" }): Promise<Record<string, unknown>>;
  bulk(ids: string[], params?: { source?: string; lang?: "zh" }): Promise<{ results: VehicleSummary[]; notFound: string[] }>;
  changes(params: { since?: string; cursor?: number; limit?: number; source?: string }): Promise<{ cursor: number; nextCursor: number; hasMore: boolean; changes: Record<string, unknown>[] }>;
  exportCsv(): Promise<string>;
  enums(params?: { lang?: "zh" }): Promise<Record<string, unknown>>;
  models(make: string | number): Promise<{ models: { id: number; name: string; nameZh: string; count: number }[] }>;
}
