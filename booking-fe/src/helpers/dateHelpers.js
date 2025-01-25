export const formatDatesDayAndMonth = (date) => {
  const options = { month: "short", day: "numeric" };
  const dateFormatted = new Intl.DateTimeFormat("en-US", options).format(
    new Date(date),
  );
  return dateFormatted;
}; //Nov -6
export const formatDateDayMonthAndYear = (date) => {
  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  const formatedDate = new Date(date);
  return formatedDate.toLocaleDateString("en-US", options).replace(/,/g, "");
};
export const calculateNights = (check_in, check_out) => {
  const check_in_date = new Date(check_in);
  const check_out_date = new Date(check_out);
  const timeDifference = check_out_date - check_in_date;
  const nights = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Chuyển milliseconds sang ngày

  return nights;
};
