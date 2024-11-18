import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { client } from "./client";
import BlankLayout from "./components/layouts/BlankLayout";
import { useAuthContext } from "./context/auth-context";
import { FullPageLoader } from "./pages/misc/FullLoaderPage";
import { NotFoundPage } from "./pages/misc/NotFoundPage";
import { LoginPage } from "./pages/LoginPage";
import SidebarLayout from "./components/layouts/SidebarLayout";
import { HomePage } from "./pages/HomePage";
import { UsersPage } from "./pages/admin/UsersPage";
import { HistoryPage } from "./pages/HistoryPage";

client.setConfig({
  baseURL: import.meta.env.VITE_API_URL,
  throwOnError: true,
});

function App() {
  const { sessionToken } = useAuthContext();

  client.instance.interceptors.request.use((config) => {
    if (sessionToken) {
      config.headers.set("Authorization", `Bearer ${sessionToken}`);
    }
    return config;
  });

  return (
    <Suspense fallback={<FullPageLoader />}>
      <BrowserRouter>
        <Routes>
          {/* Маршруты для авторизованных пользователей
          <Route element={<MainLayout />}>
            <Route path="/" element={<LoginForm />} />
            <Route element={<PrivateRoute />}>
              <Route path="profile" element={<ProfilePage />} />
              <Route path="/profile/settings" element={<SettingsPage />} />
            </Route>
          </Route> */}

          <Route element={<SidebarLayout />}>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/users" element={<UsersPage />}></Route>
            <Route path="/history" element={<HistoryPage />}></Route>
          </Route>

          {/* Маршруты для неавторизованных пользователей (например, login) */}
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
