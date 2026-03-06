const truncateText = (value, maxLength) => {
  if (value == null) return null;
  const normalized = String(value);
  return normalized.length > maxLength ? normalized.slice(0, maxLength) : normalized;
};

module.exports = {
  truncateText
};
