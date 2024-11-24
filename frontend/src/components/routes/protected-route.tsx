import { useAuthContext } from "@/context/auth-context";
import { ForbiddenPage } from "@/pages/misc/ForbiddenPage";
import { FullPageLoader } from "@/pages/misc/FullLoaderPage";
import { PropsWithChildren } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

type ProtectedRouteProps = PropsWithChildren & {
  requireSuperuser?: boolean; // Если true, доступ только для суперпользователя
  redirectTo?: string;
};

export default function ProtectedRoute({
  requireSuperuser = true,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { sessionUser } = useAuthContext();
  const location = useLocation();

  // Проверка, если текущий пользователь суперпользователь
  const isSuperuser = sessionUser?.is_superuser;

  if (sessionUser === undefined) {
    return <FullPageLoader />;
  }

  if (!sessionUser) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (requireSuperuser && !isSuperuser) {
    // return <Navigate to="/403" replace />;
    return <ForbiddenPage />;
  }

  return <Outlet />;
}
