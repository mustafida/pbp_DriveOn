const calcDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = end.getTime() - start.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days <= 0 ? 1 : days;
};

export const calcOrderAmount = (startDate, endDate, pricePerDay) => {
  const days = calcDays(startDate, endDate);
  const subtotal = days * Number(pricePerDay || 0);
  const tripFee = 1000;
  return subtotal + tripFee;
};
