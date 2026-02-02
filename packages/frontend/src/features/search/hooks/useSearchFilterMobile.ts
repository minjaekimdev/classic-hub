import { useModal } from "@/shared/ui/modals/Modal";
import { useEffect, useState } from "react";
import type { filterCategoryObjType } from "../types";

const useSearchFilterMobile = () => {
  // 검색어는 별도의 상태로 관리
  const [searchText, setSearchText] = useState("");
  const [filterValue, setFilterValue] = useState<filterCategoryObjType>({
    location: "",
    date: "",
    price: "",
  });
  // 현재 어떤 카테고리가 선택되었는지
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const filterValueChange = (value: filterCategoryObjType) => {
    setFilterValue(value);
  };

  const { isOpen, close } = useModal();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return {
    searchText,
    setSearchText,
    filterValue,
    selectedField,
    setSelectedField,
    filterValueChange,
    isOpen,
    close,
  };
};

export default useSearchFilterMobile;
