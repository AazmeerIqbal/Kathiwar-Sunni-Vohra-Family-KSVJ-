const convertToPesa = (amount) => {
  return Math.round(parseFloat(amount) * 100);
};

export { convertToPesa };
