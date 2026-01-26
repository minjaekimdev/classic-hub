import App from "@/pages/App";
import { loader as detailLoader, Detail } from "@/pages/Detail";
import Home from "@/pages/Home";
import Ranking from "@/pages/Ranking";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
    ],
  },
]);

export default router;
