const RATE = ["Kém", "Ổn", "Tốt", "Tuyệt vời"];

export const RateToText = (rate) => {
  if (rate < 2 && rate >= 1) return RATE[1];
  if (rate < 3 && rate >= 2) return RATE[2];
  if (rate < 4 && rate >= 3) return RATE[3];
  if (rate <= 5 && rate >= 4) return RATE[4];

  return "";
};

export const TextToRate = (text) => {
  if (text === RATE[0]) return { min: 1, max: 2 };
  if (text === RATE[1]) return { min: 2, max: 3 };
  if (text === RATE[2]) return { min: 3, max: 4 };
  if (text === RATE[3]) return { min: 4, max: 5 };

  return { min: null, max: null };
};

export const TextToRateText = (text) => {
  if (text === RATE[0]) return "Kém (1 - 2)";
  if (text === RATE[1]) return "Ổn (2 - 3)";
  if (text === RATE[2]) return "Tốt (3 - 4)";
  if (text === RATE[3]) return "Tuyệt vời (4 - 5)";

  return "";
};

export const convertMonthlyRateData = (monthRate) => {
  let count =
    monthRate["1"] +
    monthRate["2"] +
    monthRate["3"] +
    monthRate["4"] +
    monthRate["5"];
  let avarage =
    (0.0 +
      monthRate["1"] +
      monthRate["2"] * 2 +
      monthRate["3"] * 3 +
      monthRate["4"] * 4 +
      monthRate["5"] * 5) /
    count;

  avarage = parseFloat(avarage.toFixed(1));

  return {
    count,
    avarage,
  };
};
