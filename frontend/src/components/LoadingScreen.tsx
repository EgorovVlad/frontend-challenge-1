import { Loader } from "@mantine/core";

export const LoadingScreen = () => {
  return (
    <div className="flex flex-1 flex-row items-center justify-center h-full w-full">
      <Loader />
    </div>
  );
};
