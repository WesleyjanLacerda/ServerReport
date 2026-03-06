const toInputDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const getDefaultDateRange = () => {
  const now = new Date();
  const yesterday = new Date(now);
  const tomorrow = new Date(now);

  yesterday.setDate(yesterday.getDate() - 1);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return {
    dataIni: toInputDate(yesterday),
    dataFim: toInputDate(tomorrow)
  };
};
