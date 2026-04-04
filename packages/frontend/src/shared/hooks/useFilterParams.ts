import { useSearchParams } from "react-router-dom"

const useFilterParams = () => {
  const [searchParams] = useSearchParams();

  const params = Object.fromEntries(searchParams);
  return params;
}

export default useFilterParams;