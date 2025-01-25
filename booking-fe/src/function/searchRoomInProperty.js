export const checkRoomDateBooking = (dateSearch, dateAvailable) => {
  if (!dateAvailable) return false;

  let checkInAvailable = new Date(dateAvailable.check_in_date);
  let checkOutAvailable = new Date(dateAvailable.check_out_date);

  if (
    checkInAvailable <= dateSearch.check_in_date &&
    checkOutAvailable >= dateSearch.check_out_date
  ) {
    return true;
  }
  return false;
};
