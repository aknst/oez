import { LoginForm } from "@/components/forms/users/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const LoginPage = () => {
  return (
    <Card className="mx-auto flex-1 max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Авторизация</CardTitle>
        <CardDescription>Введите свой логин и пароль</CardDescription>
      </CardHeader>

      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
};
