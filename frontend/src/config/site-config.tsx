import {
  BookOpen,
  GalleryVerticalEnd,
  Settings2,
  SquareTerminal,
  Users,
} from "lucide-react";

export const team = {
  name: "Диагностический ассистент",
  logo: <GalleryVerticalEnd className="size-4" />,
  plan: "Команда Risk",
  url: "/",
};

export const navData = {
  navMain: [
    {
      title: "Новый запрос",
      url: "/",
      icon: SquareTerminal,
      items: [],
    },

    {
      title: "История приёмов",
      url: "/history",
      icon: BookOpen,
    },
    {
      title: "Настройки",
      url: "/settings",
      icon: Settings2,
    },
  ],
  navAdmin: [
    {
      name: "Пользователи",
      url: "/users",
      icon: Users,
    },
  ],
};
