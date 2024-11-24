import { useAuthContext } from "@/context/auth-context";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const loginFormSchema = z.object({
  username: z.string().min(1, "Введите имя пользователя."),
  password: z.string().min(1, "Введите пароль."),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginForm({ className }: React.ComponentProps<"form">) {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionUser, login } = useAuthContext();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await login({
        body: data,
      });

      toast.success(`Успешная авторизация!`);
      const query = new URLSearchParams(location.search);
      const callbackUrl = query.get("callbackUrl");
      navigate(callbackUrl || "/");
    } catch (error) {
      toast.error("Ошибка аутентификации");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (sessionUser) {
      const query = new URLSearchParams(location.search);
      const callbackUrl = query.get("callbackUrl");
      navigate(callbackUrl || "/");
    }
  }, [sessionUser, navigate, location.search]);
  // if (sessionUser) {
  //   const query = new URLSearchParams(location.search);
  //   const callbackUrl = query.get("callbackUrl");
  //   navigate(callbackUrl || "/");
  // }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-6", className)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя пользователя</FormLabel>
              <FormControl>
                <Input placeholder="user1917" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <Input type="password" placeholder="**********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? <Loader2 className="animate-spin" /> : "Войти"}
        </Button>

        <div className="relative">
          {/* <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div> */}
          {/* <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              ИЛИ
            </span>
          </div> */}
        </div>

        {/* <Button variant="outline" className="w-full">
          Регистрация
        </Button> */}
      </form>
    </Form>
  );
}
