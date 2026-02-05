import type { Hall } from "@classic-hub/shared/types/client";
import type { DBFacility, DBHall } from "@classic-hub/shared/types/database";

type PickedFacility = Pick<
  DBFacility,
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
export type RawType = Pick<DBHall, "seat_count"> & {
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
    restaurant: f.has_restaurant,
    cafe: f.has_cafe,
    store: f.has_store,
    nolibang: f.has_nolibang,
    suyu: f.has_suyu,
    parking: f.has_parking,
    disabledParking: f.has_disabled_parking,
    disabledRestroom: f.has_disabled_restroom,
    disabledRamp: f.has_disabled_ramp,
    disabledElevator: f.has_disabled_elevator,
  };
};
