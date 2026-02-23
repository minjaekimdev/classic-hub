import { loader as detailLoader, Detail } from "@/pages/Detail";
import Home from "@/pages/Home";
import Ranking from "@/pages/Ranking";
import Result from "@/pages/Result";
import { createBrowserRouter, Outlet } from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components
const RootLayout = () => {
  return (
    <>
      <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "ranking",
        element: <Ranking />,
      },
      {
        loader: detailLoader,
        path: "detail/:performanceId",
        element: <Detail />,
      },
      {
        path: "result",
        element: <Result />,
      }
    ],
  },
]);

export default router;
