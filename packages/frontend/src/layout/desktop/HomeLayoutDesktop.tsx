import { useIntersectionObserver } from "@/shared/hooks/useIntersectionObserver";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Ref,
} from "react";
import HeaderDesktop from "./HeaderDesktop";

interface HomeLayoutDesktopContextType {
  ref: Ref<HTMLDivElement>;
  isScrollZero: boolean;
  isExpand: boolean;
  isActive: boolean;
  marginTopClassName: string;
  expand: () => void;
  shrink: () => void;
}
const HomeLayoutDesktopContext =
  createContext<HomeLayoutDesktopContextType | null>(null);

const HomeLayoutDesktopProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // div가 화면에서 사라지는지, 나타나는지 관찰
  // 화면에 아직 참조된 요소가 보이면 isScrollZero: true, 스크롤 발생 X
  // 보이지 않으면 false, 스크롤 발생 O
  const { ref, isIntersecting: isScrollZero } = useIntersectionObserver();

  const [isActive, setIsActive] = useState(false);

  const expand = () => {
    setIsActive(true);
  }
  const shrink = () => {
    setIsActive(false);
  }

  // 스크롤이 맨 위로 올라갈 떄마다 isFilterActive를 false로 초기화
  useEffect(() => {
    if (isScrollZero) {
      shrink();
    }
  }, [isScrollZero]);

  // 헤더가 확장되는 경우는 scroll이 맨 위에 있거나 필터가 클릭되는 경우
  const isExpand = isScrollZero || isActive;

  // 모바일일 때와 데스크톱일 때 메인 영역의 상단 여백을 결정
  const marginTopClassName = isScrollZero
    ? "mt-desktop-header-expanded"
    : "mt-desktop-header-shrinked";

  return (
    <HomeLayoutDesktopContext.Provider
      value={{
        ref,
        isScrollZero,
        isExpand,
        isActive,
        marginTopClassName,
        expand,
        shrink,
      }}
    >
      {children}
    </HomeLayoutDesktopContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useHomeLayoutDesktop = () => {
  const context = useContext(HomeLayoutDesktopContext);
  if (!context) {
    throw new Error(
      "useHomeLayoutDesktop should be used within a ModalProvider.",
    );
  }
  return context;
};

export const HomeLayoutDesktopWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { ref, isActive, marginTopClassName } =
    useHomeLayoutDesktop();
  return (
    <>
      <HeaderDesktop />
      {isActive && (
        // 필터가 열렸다면 overlay 보여주기
        <div className="fixed top-0 left-0 z-15 bg-[rgba(0,0,0,0.3)] w-full h-full"></div>
      )}
      <div ref={ref} className="h-1 bg-transparent"></div>
      <main className={`pt-6 pb-[6.12rem] ${marginTopClassName}`}>
        {children}
      </main>
    </>
  );
};

const HomeLayoutDesktopRoot = ({ children }: { children: React.ReactNode }) => {
  return <HomeLayoutDesktopProvider>{children}</HomeLayoutDesktopProvider>;
};

const HomeLayoutDesktop = Object.assign(HomeLayoutDesktopRoot, {
  Wrapper: HomeLayoutDesktopWrapper,
});

export default HomeLayoutDesktop;
