import type { PhoneDto } from '../models/footer.model';

export interface ClinicPhone {
  /** The number exactly as the footer API returned it, e.g. `0912 345 6789`. */
  label: string;
  /** Digits only, safe to put in a `tel:` link. */
  dial: string;
}

export interface ClinicContact {
  /** The single clinic number advertised by the header and the footer. */
  phone: ClinicPhone | null;
  /** Text stored in a phone field that is not a number (e.g. a postal address). */
  addressExtras: string[];
}

/** Shorter values are captions, not dialable numbers. */
const MIN_PHONE_DIGITS = 7;

function asPhone(value?: string | null): ClinicPhone | null {
  const label = (value ?? '').trim();

  if (!label) {
    return null;
  }

  let digits = label.replace(/\D/g, '');

  // Accept the international form of an Iranian number (`+98…`).
  if (digits.length === 12 && digits.startsWith('98')) {
    digits = `0${digits.slice(2)}`;
  }

  return digits.length >= MIN_PHONE_DIGITS ? { label, dial: digits } : null;
}

/**
 * Resolves the one clinic number the header and the footer advertise from the
 * footer API payload — the only authoritative source for it.
 *
 * The payload exposes two fields; the mobile line is the booking channel, so it
 * wins when both are present, otherwise the landline is used. There is no
 * hardcoded fallback: when the API has no usable number, both components hide
 * the phone instead of advertising a number the database does not contain.
 */
export function resolveClinicContact(phone?: PhoneDto | null): ClinicContact {
  const mobile = asPhone(phone?.mobile);
  const landline = asPhone(phone?.landline);

  const addressExtras: string[] = [];
  const rawLandline = (phone?.landline ?? '').trim();

  if (rawLandline && !landline) {
    addressExtras.push(rawLandline);
  }

  return { phone: mobile ?? landline, addressExtras };
}
