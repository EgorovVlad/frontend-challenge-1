import { Outlet } from "react-router-dom";
import { LogoutButton } from "~/components/LogoutButton";
import { Footer } from "~/components/Footer";
import { Box, Title } from "@mantine/core";

export default function BasicLayout() {
  return (
    <div className="h-full w-full">
      <Box className="flex flex-row p-2 border-b-2 border-b-indigo-100 mb-4">
        <Title size={26}>TiC Manager</Title>
        <LogoutButton className="ml-auto" variant="light" />
      </Box>
      <Outlet />
      <Footer />
    </div>
  );
}
