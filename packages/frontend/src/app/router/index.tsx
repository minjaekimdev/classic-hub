import { loader as detailLoader, Detail } from "@/pages/Detail";
import Home from "@/pages/Home";
import Ranking from "@/pages/Ranking";
import Result from "@/pages/Result";
import { BREAKPOINTS } from "@/shared/constants";
import useBreakpoint from "@/shared/hooks/useBreakpoint";
import BottomNavBar from "@/shared/ui/navigation/BottomNavBar";
import { createBrowserRouter, Outlet } from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components
const RootLayout = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
const MainLayout = () => {
  const isMobile = useBreakpoint(BREAKPOINTS.MOBILE);
  return (
    <div className="">
      <main className="">
        <Outlet />
      </main>
      {isMobile && <BottomNavBar />}
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        // 하단 네비게이션이 존재하는 레이아웃
        element: <MainLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "ranking", element: <Ranking /> },
          { path: "result", element: <Result /> },
        ],
      },
      {
        path: "detail/:performanceId",
        loader: detailLoader,
        element: <Detail />,
      },
    ],
  },
]);

export default router;
