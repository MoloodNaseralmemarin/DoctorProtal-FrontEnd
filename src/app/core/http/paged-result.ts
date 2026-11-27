import { PagedResult } from '../models/paged-result.model';

/**
 * The public endpoints answer either with a plain array (older deployments) or
 * with a paged envelope. Every list feature normalises through this helper so
 * components only ever deal with one shape.
 */
export function toPagedResult<T>(
  response: readonly T[] | Partial<PagedResult<T>> | null | undefined,
  pageNumber = 1,
  pageSize = 10,
): PagedResult<T> {
  if (Array.isArray(response)) {
    const items = [...response];

    return { items, totalCount: items.length, pageNumber, pageSize };
  }

  const paged = (response ?? {}) as Partial<PagedResult<T>>;
  const items = Array.isArray(paged.items) ? [...paged.items] : [];

  return {
    items,
    totalCount: typeof paged.totalCount === 'number' ? paged.totalCount : items.length,
    pageNumber: typeof paged.pageNumber === 'number' ? paged.pageNumber : pageNumber,
    pageSize: typeof paged.pageSize === 'number' ? paged.pageSize : pageSize,
  };
}

/** Total number of pages for a paged payload, never below zero. */
export function pageCount(result: Pick<PagedResult<unknown>, 'totalCount' | 'pageSize'>): number {
  if (result.pageSize <= 0) {
    return 0;
  }

  return Math.max(0, Math.ceil(result.totalCount / result.pageSize));
}
