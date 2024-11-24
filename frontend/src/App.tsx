import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { client } from "./client";
import BlankLayout from "./components/layouts/BlankLayout";
import { FullPageLoader } from "./pages/misc/FullLoaderPage";
import { NotFoundPage } from "./pages/misc/NotFoundPage";
import { LoginPage } from "./pages/LoginPage";
import SidebarLayout from "./components/layouts/SidebarLayout";
import { HomePage } from "./pages/HomePage";
import { UsersPage } from "./pages/admin/UsersPage";
import { HistoryPage } from "./pages/HistoryPage";
import { PatientsPage } from "./pages/PatientsPage";
import ProtectedRoute from "./components/routes/protected-route";
import PrivateRoute from "./components/routes/private-route";
import { useAuthStore } from "./states/auth-state";

client.setConfig({
  baseURL: import.meta.env.VITE_API_URL,
  throwOnError: true,
});

client.instance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

function App() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <BrowserRouter>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route element={<SidebarLayout />}>
              <Route path="/" element={<HomePage />}></Route>

              <Route path="/patients" element={<PatientsPage />}></Route>
              <Route path="/history" element={<HistoryPage />}></Route>
              <Route element={<ProtectedRoute />}>
                <Route path="/users" element={<UsersPage />}></Route>
              </Route>
            </Route>
          </Route>

          <Route element={<BlankLayout />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route element={<BlankLayout />}>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
