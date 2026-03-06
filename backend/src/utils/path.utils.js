const path = require('path');

const SAFE_SEGMENT_REGEX = /^[a-zA-Z0-9._-]+$/;

const sanitizePathSegment = (value) => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed === '.' || trimmed === '..') return null;
  if (!SAFE_SEGMENT_REGEX.test(trimmed)) return null;
  return trimmed;
};

const sanitizeFilename = (value) => {
  if (typeof value !== 'string') return null;
  const baseName = path.basename(value).trim();
  if (!baseName || baseName === '.' || baseName === '..') return null;
  const safeName = baseName.replace(/[^a-zA-Z0-9._-]/g, '_');
  return safeName || null;
};

const resolvePathInsideBase = (baseDir, childSegment) => {
  const safeSegment = sanitizePathSegment(childSegment);
  if (!safeSegment) return null;

  const resolvedBase = path.resolve(baseDir);
  const resolvedTarget = path.resolve(resolvedBase, safeSegment);

  if (resolvedTarget !== resolvedBase && !resolvedTarget.startsWith(`${resolvedBase}${path.sep}`)) {
    return null;
  }

  return resolvedTarget;
};

module.exports = {
  sanitizePathSegment,
  sanitizeFilename,
  resolvePathInsideBase
};
