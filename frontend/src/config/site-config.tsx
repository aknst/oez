import {
  BookOpen,
  Hospital,
  Stethoscope,
  UserRoundCheck,
  Users,
} from "lucide-react";

export const team = {
  name: "Диагностический ассистент",
  logo: <Hospital className="size-4" />,
  plan: "Разработка команды Risk",
  url: "/",
};

export const navData = {
  navMain: [
    {
      title: "Новый прием",
      url: "/",
      icon: Stethoscope,
      items: [],
    },
    {
      title: "История приемов",
      url: "/history",
      icon: BookOpen,
    },
  ],
  navAdmin: [
    {
      title: "Пациенты",
      url: "/patients",
      icon: Users,
    },
    {
      title: "Пользователи",
      url: "/users",
      icon: UserRoundCheck,
    },
  ],
};
