interface TicketVendorType {
  name: string;
  url: string;
}

export interface PerformanceType {
  posterUrl: string;
  name: string;
  artist: string;
  date: string;
  hall: string;
  ticketVendors?: TicketVendorType[];
}

export interface RankingPerformanceType extends PerformanceType{
  rank: string;
}