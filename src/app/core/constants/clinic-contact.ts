import type { PhoneDto } from '../models/footer.model';

export interface ClinicPhone {
  /** Formatted the way visitors read it, e.g. `0918 305 0600`. */
  label: string;
  /** Digits only, safe to put in a `tel:` link. */
  dial: string;
}

export interface ClinicPhones {
  landline: ClinicPhone;
  mobile: ClinicPhone;
}

/**
 * The clinic contact numbers. Both the public header (booking CTA, top bar and
 * mobile drawer) and the footer resolve to these values, so a visitor never
 * reads one number and dials another.
 */
export const CLINIC_PHONES: ClinicPhones = {
  landline: { label: '081-32532356', dial: '08132532356' },
  mobile: { label: '0918 305 0600', dial: '09183050600' },
};

/** Shorter values are captions, not dialable numbers. */
const MIN_PHONE_DIGITS = 7;

interface PhoneCandidate {
  label: string;
  digits: string;
}

function asPhone(value?: string | null): PhoneCandidate | null {
  const label = (value ?? '').trim();

  if (!label) {
    return null;
  }

  let digits = label.replace(/\D/g, '');

  // Accept the international form of an Iranian number (`+98…`).
  if (digits.length === 12 && digits.startsWith('98')) {
    digits = `0${digits.slice(2)}`;
  }

  return digits.length >= MIN_PHONE_DIGITS ? { label, digits } : null;
}

function isMobile(digits: string): boolean {
  return digits.startsWith('09');
}

function toClinicPhone(candidate: PhoneCandidate): ClinicPhone {
  return { label: candidate.label, dial: candidate.digits };
}

export interface ResolvedClinicPhones extends ClinicPhones {
  /** Text that was stored in a phone field but is not a number (e.g. an address). */
  addressExtras: string[];
}

/**
 * Maps the numbers the footer API returns onto the canonical clinic numbers.
 *
 * The payload is classified by value rather than by field name because some
 * deployments return the landline in `mobile` (or the postal address in
 * `landline`). Anything that cannot be classified falls back to
 * {@link CLINIC_PHONES}, so the header and the footer always agree.
 */
export function resolveClinicPhones(phone?: PhoneDto | null): ResolvedClinicPhones {
  const landlineCandidate = asPhone(phone?.landline);
  const mobileCandidate = asPhone(phone?.mobile);

  const addressExtras: string[] = [];
  const rawLandline = (phone?.landline ?? '').trim();

  if (rawLandline && !landlineCandidate) {
    addressExtras.push(rawLandline);
  }

  const landline =
    (landlineCandidate && !isMobile(landlineCandidate.digits)
      ? toClinicPhone(landlineCandidate)
      : null) ??
    (mobileCandidate && !isMobile(mobileCandidate.digits)
      ? toClinicPhone(mobileCandidate)
      : null) ??
    CLINIC_PHONES.landline;

  const mobile =
    (mobileCandidate && isMobile(mobileCandidate.digits)
      ? toClinicPhone(mobileCandidate)
      : null) ??
    (landlineCandidate && isMobile(landlineCandidate.digits)
      ? toClinicPhone(landlineCandidate)
      : null) ??
    CLINIC_PHONES.mobile;

  return { landline, mobile, addressExtras };
}
