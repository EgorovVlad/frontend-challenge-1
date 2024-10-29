import { createBrowserRouter } from "react-router-dom";
import BasicLayout from "./layout/BasicLayout";
import NotFoundPage from "./pages/error/NotFound";
import LoginPage from "~/pages/LoginPage";
import AuthLayout from "~/layout/AuthLayout";
import TicFilesPage from '~/pages/TicFilesPage';

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        element: <BasicLayout />,
        children: [
          {
            path: "/",
            element: <TicFilesPage />,
          },
        ],
        errorElement: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
