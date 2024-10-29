import { TicFilesTable } from "~/components/TicFilesTable";
import { useEffect } from "react";
import { useTicStore } from "~/stores/tic.store";
import { LoadingScreen } from "~/components/LoadingScreen";
import { Title, Box, Container } from '@mantine/core';
import { UploadTicCsvFormModalButton } from "~/components/UploadTicCsvForm";
import { observer } from "mobx-react-lite";

const TicFilesPage = observer(() => {
  const { isLoading, ticsFiles, loadTicFiles } = useTicStore();
  useEffect(() => void loadTicFiles(), [loadTicFiles]);

  if (isLoading) return <LoadingScreen />;
  return (
    <Container className="min-h-full">
      <Box className="flex flex-row justify-between">
        <Title className="text-center">TiC Files</Title>
        <UploadTicCsvFormModalButton />
      </Box>
      <TicFilesTable files={ticsFiles} />
    </Container>
  );
});

export default TicFilesPage;
