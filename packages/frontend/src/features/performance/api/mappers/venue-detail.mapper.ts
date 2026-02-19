import type { Hall } from "@classic-hub/shared/types/client";
import type { DBFacilityRead, DBHallRead } from "@classic-hub/shared/types/database";

type PickedFacility = Pick<
  DBFacilityRead,
  | "name"
  | "tel"
  | "url"
  | "adress"
  | "has_restaurant"
  | "has_cafe"
  | "has_store"
  | "has_nolibang"
  | "has_suyu"
  | "has_parking"
  | "has_disabled_parking"
  | "has_disabled_restroom"
  | "has_disabled_ramp"
  | "has_disabled_elevator"
>;
export type RawType = Pick<DBHallRead, "seat_count"> & {
  facilities: PickedFacility | null;
};
export const getMappedFacilityData = (raw: RawType): Hall => {
  const f = raw.facilities;

  if (!f) {
    return {
      name: null,
      tel: null,
      url: null,
      address: null,
      seatCount: 0,
      restaurant: false,
      cafe: false,
      store: false,
      nolibang: false,
      suyu: false,
      parking: false,
      disabledParking: false,
      disabledRestroom: false,
      disabledRamp: false,
      disabledElevator: false,
    };
  }

  return {
    name: f.name,
    tel: f.tel,
    url: f.url,
    address: f.adress,
    seatCount: raw.seat_count,
    restaurant: f.has_restaurant ?? false,
    cafe: f.has_cafe ?? false,
    store: f.has_store ?? false,
    nolibang: f.has_nolibang ?? false,
    suyu: f.has_suyu ?? false,
    parking: f.has_parking ?? false,
    disabledParking: f.has_disabled_parking ?? false,
    disabledRestroom: f.has_disabled_restroom ?? false,
    disabledRamp: f.has_disabled_ramp ?? false,
    disabledElevator: f.has_disabled_elevator ?? false,
  };
};
