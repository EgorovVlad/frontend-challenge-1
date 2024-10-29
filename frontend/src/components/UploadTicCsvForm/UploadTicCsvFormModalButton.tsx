import React from "react";
import { Button, Modal } from "@mantine/core";
import { UploadTicCsvForm } from "~/components/UploadTicCsvForm";
import { useToggle } from "@mantine/hooks";

export const UploadTicCsvFormModalButton: React.FC = () => {
  const [opened, toggle] = useToggle();
  return (
    <>
      <Button color="indigo" onClick={toggle as VoidFunction}>
        Upload CSV
      </Button>
      <Modal size="80%" opened={opened} onClose={toggle} title="Upload CSV">
        <UploadTicCsvForm onSubmitted={toggle} />
      </Modal>
    </>
  );
};
