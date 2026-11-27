import { HttpErrorResponse } from '@angular/common/http';

/**
 * Normalised shape for every failed API call. Components render `message`
 * directly, so all features report failures with the same wording instead of
 * each one inventing its own text.
 */
export interface ApiError {
  /** HTTP status, or `0` when the request never reached the server. */
  status: number;
  message: string;
  /** Raw payload, useful when a feature needs a specific field. */
  details?: unknown;
}

const NETWORK_ERROR_MESSAGE = 'خطا در برقراری ارتباط با سرور';
const UNKNOWN_ERROR_MESSAGE = 'خطای غیرمنتظره‌ای رخ داد. لطفاً دوباره تلاش کنید.';

const STATUS_MESSAGES: Record<number, string> = {
  0: NETWORK_ERROR_MESSAGE,
  400: 'درخواست ارسال‌شده معتبر نیست',
  401: 'نشست شما منقضی شده است. لطفاً دوباره وارد شوید',
  403: 'دسترسی به این بخش مجاز نیست',
  404: 'مورد درخواستی یافت نشد',
  409: 'این مورد از قبل وجود دارد',
  413: 'حجم فایل ارسالی بیش از حد مجاز است',
  415: 'نوع فایل ارسالی پشتیبانی نمی‌شود',
  500: 'خطای داخلی سرور',
  502: 'سرور در دسترس نیست',
  503: 'سرویس موقتاً در دسترس نیست',
};

/** Reads a human readable message out of the ASP.NET Core problem payload. */
function readServerMessage(body: unknown): string | null {
  if (!body) {
    return null;
  }

  if (typeof body === 'string') {
    return body.trim() || null;
  }

  if (typeof body !== 'object') {
    return null;
  }

  const payload = body as Record<string, unknown>;
  const candidate = payload['message'] ?? payload['detail'] ?? payload['title'];

  return typeof candidate === 'string' && candidate.trim() ? candidate.trim() : null;
}

/** Maps anything thrown by `HttpClient` onto a stable `ApiError`. */
export function toApiError(error: unknown): ApiError {
  if (error instanceof HttpErrorResponse) {
    return {
      status: error.status,
      message:
        readServerMessage(error.error) ??
        STATUS_MESSAGES[error.status] ??
        NETWORK_ERROR_MESSAGE,
      details: error.error,
    };
  }

  if (error instanceof Error && error.message) {
    return { status: 0, message: error.message };
  }

  return { status: 0, message: UNKNOWN_ERROR_MESSAGE };
}

/** Convenience accessor for the common case: show the message in a toast. */
export function apiErrorMessage(error: unknown): string {
  return toApiError(error).message;
}
