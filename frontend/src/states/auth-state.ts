import { create } from "zustand";

interface AuthState {
  token: string | null; // Токен может быть строкой или null
  setToken: (token: string | null) => void; // Функция для обновления токена
  clearToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("sessionToken"), // Инициализация токена из localStorage
  setToken: (token) => {
    if (token) {
      localStorage.setItem("sessionToken", token); // Сохраняем токен в localStorage
    } else {
      localStorage.removeItem("sessionToken"); // Удаляем токен из localStorage, если он null
    }
    set({ token });
  },
  clearToken: () => {
    localStorage.removeItem("sessionToken"); // Удаляем токен из localStorage
    set({ token: null });
  },
}));
