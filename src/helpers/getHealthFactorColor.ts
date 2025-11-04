export const getHealthFactorColor = (hf: number) => {
  if (hf < 1) {
    return "red.600";
  }
  if (hf < 2) {
    return "orange.500";
  }
  return "green.600";
};
