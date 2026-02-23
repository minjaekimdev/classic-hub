import { useQuery } from "@tanstack/react-query";
import getVenueInfo from "../fetchers/get-venue-detail";

const useDetailVenueInfo = (venueId: string | null, venueName: string | null) => {
  return useQuery({
    queryKey: ["performance", "venue", venueId],
    queryFn: () => getVenueInfo(venueId!, venueName!),
    enabled: !!venueId,
  })
}

export default useDetailVenueInfo;