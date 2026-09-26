function hasLocalizedValue(value) {
  if (value == null) {
    return false;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (typeof value === "object") {
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    if (Array.isArray(value.blocks)) {
      return value.blocks.length > 0;
    }
  }

  return true;
}

/**
 * Reads `{field}_ko` / `{field}_en` with cross-locale fallback.
 * @param {Record<string, unknown> | null | undefined} item
 * @param {string} field
 * @param {"ko" | "en"} locale
 */
export function pickLocalized(item, field, locale) {
  if (!item) {
    return null;
  }

  const primary = item[`${field}_${locale}`];
  const fallbackLocale = locale === "ko" ? "en" : "ko";
  const fallback = item[`${field}_${fallbackLocale}`];

  if (hasLocalizedValue(primary)) {
    return primary;
  }

  if (hasLocalizedValue(fallback)) {
    return fallback;
  }

  const plain = item[field];
  if (hasLocalizedValue(plain)) {
    return plain;
  }

  return null;
}
