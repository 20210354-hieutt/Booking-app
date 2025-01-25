export class FindRoomDto {
  check_in_date: Date;
  check_out_date: Date;
  capacity: {
    adults: number;
    childs: {
      count: number;
      age: number;
    };
    room: number;
  };
}
