// import supabase from "@/app/api/supabase-client";

// interface QueryValue {
//   keyword: string | null;
//   location: string | null;
//   minPrice: string | null;
//   maxPrice: string | null;
//   startDate: string | null;
//   endDate: string | null;
// }

// const getFilteredPerformances = (value: QueryValue) => {
//   const {keyword, location, minPrice, maxPrice, startDate, endDate} = value;

//   const query = supabase.from("performances").select("*");

//   if (keyword) {
//     query = query.or(`performance_name.ilike.%${keyword}%, cast.ilike.%${keyword}%`);
//   }
//   if (location) {
//     query = query.eq("area", location);
//   }
//   if (minPrice) {
//     query = query.lte("max_price", minPrice);
//     if (maxPrice) {
//       query = query.gte("min_price", maxPrice);
//     }
//   }
  

//   // 기본: 전체 공연을 대상으로


//   // keyword가 존재한다면 DB에서 검색

//   // location이 존재한다면 검색

//   // minPrice, maxPrice가 있는 경우 lte, gte로 검색

//   // startDate, endDate가 있는 경우 lte, gte로 검색

// };

// export default getFilteredPerformances;