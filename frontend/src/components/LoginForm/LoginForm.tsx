import React, { useState, useCallback } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextInput, PasswordInput, Button, Box, Title } from "@mantine/core";
import { useAuthStore } from "~/stores/auth.store";
import { AuthApi } from "~/api/AuthApi";
import { observer } from "mobx-react-lite";
import { sleep } from "~/utils/sleep";
import { loginSchema } from "~/components/LoginForm/validation";

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = observer(() => {
  const { isAuthenticated, setLoggedIn } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "username",
      password: "password",
    },
  });

  // Function to handle form submission
  const handleFormSubmit: SubmitHandler<LoginFormData> = useCallback(
    async (data) => {
      setIsLoading(true);
      try {
        await sleep(1000); // imitate network request
        await AuthApi.login(data.username, data.password);
        setLoggedIn(true);
      } catch {
        alert("Invalid login");
      } finally {
        setIsLoading(false);
      }
    },
    [setLoggedIn],
  );

  return (
    <Box className="w-full">
      <Title className="mb-2 text-center">Login</Title>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Controller
          name="username"
          control={control}
          render={({ field }) => <TextInput label="Usename" placeholder="Enter your username" {...field} error={errors.username?.message ?? null} className="mb-4" />}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => <PasswordInput label="Password" placeholder="Enter your password" {...field} error={errors.password?.message ?? null} className="mb-6" />}
        />
        <Button type="submit" variant="filled" color="indigo" fullWidth className="mt-6" disabled={isAuthenticated || isLoading} loading={isLoading}>
          Login
        </Button>
      </form>
    </Box>
  );
});
