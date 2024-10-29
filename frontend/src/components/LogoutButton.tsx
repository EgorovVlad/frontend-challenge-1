import React, { useCallback, useState } from "react";
import { observer } from "mobx-react-lite";
import { useAuthStore } from "~/stores/auth.store";
import { Button, ButtonProps } from "@mantine/core";
import { AuthApi } from "~/api/AuthApi";
import { sleep } from '~/utils/sleep';

type LogoutButtonProps = Omit<ButtonProps, "onClick" | "loading" | "disabled">;

export const LogoutButton: React.FC<LogoutButtonProps> = observer((props) => {
  const { isAuthenticated, setLoggedIn } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = useCallback(async () => {
    setIsLoading(true);
    try {
      await sleep(1000) // imitate network request
      await AuthApi.logout();
      setLoggedIn(false);
    } catch {
      alert("Error logging out");
    } finally {
      setIsLoading(false);
    }
  }, [setLoggedIn]);

  return (
    <Button variant="filled" color="indigo" {...props} disabled={!isAuthenticated || isLoading} loading={isLoading} onClick={handleLogout}>
      Logout
    </Button>
  );
});
