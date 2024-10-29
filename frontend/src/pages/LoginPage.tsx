import { LoginForm } from "~/components/LoginForm";
import { Center, Container } from "@mantine/core";

function LoginPage() {
  return (
    <Container className="h-full">
      <Center className="h-full">
        <LoginForm />
      </Center>
    </Container>
  );
}

export default LoginPage;
