/**
 * Utility functions for handling hospital phone numbers and dialer links.
 */

export const MAIN_HOSPITAL_TRUNK = '042215100';

/**
 * Generates a callable tel: URI for mobile and desktop telephony.
 * For internal hospital extensions (e.g. '3110', '1000', '0'),
 * it formats as 'tel:042215100,3110' so mobile devices dial the
 * main hospital line first, followed by a DTMF pause (comma) and the extension.
 * For full external numbers (e.g. '042-215100', '042-245555'),
 * it dials the number directly.
 */
export function getCallablePhoneHref(phone: string): string {
  const digits = (phone || '').replace(/[^0-9]/g, '');
  if (!digits) {
    return `tel:${MAIN_HOSPITAL_TRUNK}`;
  }

  // If already a full external line (starts with 0 and 9+ digits)
  if (digits.startsWith('0') && digits.length >= 9) {
    return `tel:${digits}`;
  }

  // Hospital internal extension (e.g. 3110, 1000, 0)
  return `tel:${MAIN_HOSPITAL_TRUNK},${digits}`;
}

/**
 * Returns a human-friendly string describing the dialed line and extension.
 */
export function getDialTooltip(phone: string, unitName?: string): string {
  const digits = (phone || '').replace(/[^0-9]/g, '');
  if (digits.startsWith('0') && digits.length >= 9) {
    return `โทรออกหมายเลข ${phone}${unitName ? ` (${unitName})` : ''}`;
  }
  return `โทรออก 042-215100 ต่อ ${digits}${unitName ? ` (${unitName})` : ''} [tel:042215100,${digits}]`;
}
