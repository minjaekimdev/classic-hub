import { useIntersectionObserver } from "@/shared/hooks/useIntersectionObserver";
import Footer from "@/widgets/shared/ui/Footer";
import HeaderDesktop from "@/widgets/shared/ui/HeaderDesktop";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Ref,
} from "react";

type LayoutVariant = "home" | "main";

interface LayoutDesktopContextType {
  ref: Ref<HTMLDivElement>;
  isScrollZero: boolean;
  isExpand: boolean;
  isActive: boolean;
  marginTopClassName: string;
  expand: () => void;
  shrink: () => void;
}
const LayoutDesktopContext = createContext<LayoutDesktopContextType | null>(
  null,
);

interface LayoutDesktopProviderProps {
  variant: LayoutVariant;
  children: React.ReactNode;
}
const LayoutDesktopProvider = ({
  variant,
  children,
}: LayoutDesktopProviderProps) => {
  // div가 화면에서 사라지는지, 나타나는지 관찰
  // 화면에 아직 참조된 요소가 보이면 isScrollZero: true, 스크롤 발생 X
  // 보이지 않으면 false, 스크롤 발생 O
  const { ref, isIntersecting: isScrollZero } = useIntersectionObserver();

  const [isActive, setIsActive] = useState(false);

  const expand = () => {
    setIsActive(true);
  };
  const shrink = () => {
    setIsActive(false);
  };

  // 스크롤이 맨 위로 올라갈 떄마다 isFilterActive를 false로 초기화
  useEffect(() => {
    if (isScrollZero) {
      shrink();
    }
  }, [isScrollZero]);

  // 홈페이지인 경우 scroll이 맨 위에 있거나 필터가 클릭될 때 헤더가 확장됨
  // 기타 페이지의 경우 필터가 클릭될 때만 헤더가 확장됨
  const isExpand = variant === "home" ? isScrollZero || isActive : isActive;

  // 메인 영역의 상단 여백을 결정
  // 홈페이지이면서 스크롤이 0인 경우에만 상단 여백이 큼
  const marginTopClassName =
    variant === "home" && isScrollZero
      ? "mt-desktop-header-expanded"
      : "mt-desktop-header-shrinked";

  return (
    <LayoutDesktopContext.Provider
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
    </LayoutDesktopContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLayoutDesktop = () => {
  const context = useContext(LayoutDesktopContext);
  if (!context) {
    throw new Error("useLayoutDesktop should be used within a ModalProvider.");
  }
  return context;
};

interface LayoutDesktopWrapperProps {
  hasPaddingTop: boolean;
  children: React.ReactNode;
}
export const LayoutDesktopWrapper = ({
  hasPaddingTop = true,
  children,
}: LayoutDesktopWrapperProps) => {
  const { ref, isActive, marginTopClassName } = useLayoutDesktop();

  const paddingTopClassName = hasPaddingTop ? "pt-6": "";

  return (
    <>
      <HeaderDesktop />
      {isActive && (
        // 필터가 열렸다면 overlay 보여주기
        <div className="fixed top-0 left-0 z-15 bg-[rgba(0,0,0,0.3)] w-full h-full"></div>
      )}
      <div ref={ref} className="h-1 bg-transparent"></div>
      <main className={`${paddingTopClassName} pb-[6.12rem] ${marginTopClassName} max-w-7xl mx-auto`}>
        {children}
      </main>
      <Footer />
    </>
  );
};

interface LayoutDesktopRootProps {
  variant: LayoutVariant;
  children: React.ReactNode;
}
const LayoutDesktopRoot = ({ variant, children }: LayoutDesktopRootProps) => {
  return (
    <LayoutDesktopProvider variant={variant}>{children}</LayoutDesktopProvider>
  );
};

const LayoutDesktop = Object.assign(LayoutDesktopRoot, {
  Wrapper: LayoutDesktopWrapper,
});

export default LayoutDesktop;
