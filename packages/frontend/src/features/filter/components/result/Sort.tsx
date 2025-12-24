import CategoryHeader from "./CategoryHeader";
import CategoryLayout from "./CategoryLayout";

const SORT_OPTIONS = [
  { id: "imminent", label: "공연임박순" },
  { id: "price_asc", label: "낮은가격순" },
  { id: "price_desc", label: "높은가격순" },
  { id: "alphabet", label: "가나다순" },
];

interface SortProps {
  selectedSort: string;
  handleSortChange: (id: string) => void;
}
const Sort = ({ selectedSort, handleSortChange }: SortProps) => {
  return (
    <CategoryLayout>
      <CategoryHeader text="정렬" />
      <div className="flex flex-wrap gap-2">
        {SORT_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSortChange(option.id)}
            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors border
                    ${
                      selectedSort === option.id
                        ? "bg-[#cc0000] border-[#cc0000] text-white shadow-sm"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </CategoryLayout>
  );
};

export default Sort;
