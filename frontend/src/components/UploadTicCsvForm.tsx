import React, { useState, useCallback, useRef } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FileInput, Stack, Modal } from "@mantine/core";
import Papa from "papaparse";
import { AgGridReact } from "ag-grid-react";

import { GridApi, ColDef, CellClassParams } from "ag-grid-community";
import { useTicStore } from "~/stores/tic.store";

const schema = z.object({
  csvFile: z.instanceof(File).optional(),
});

type FormData = z.infer<typeof schema>;
interface CsvData {
  [key: string]: string;
}

// Zod validation schema for the CSV fields
const csvValidationSchema = z.object({
  "Claim ID": z.string().min(1, "Claim ID is required"),
  "Subscriber ID": z.string().min(1, "Subscriber ID is required"),
  "Member Sequence": z.string().min(1, "Member Sequence is required"),
  "Claim Status": z.string().min(1, "Claim Status is required"),
  Billed: z.string().refine((val) => !isNaN(parseFloat(val)), "Billed must be a number"),
  Allowed: z.string().refine((val) => !isNaN(parseFloat(val)), "Allowed must be a number"),
  Paid: z.string().refine((val) => !isNaN(parseFloat(val)), "Paid must be a number"),
  "Payment Status Date": z.string().min(1, "Payment Status Date is required"),
  "Service Date": z.string().min(1, "Service Date is required"),
  "Received Date": z.string().min(1, "Received Date is required"),
  "Entry Date": z.string().min(1, "Entry Date is required"),
  "Processed Date": z.string().min(1, "Processed Date is required"),
  "Paid Date": z.string().min(1, "Paid Date is required"),
  "Payment Status": z.string().min(1, "Payment Status is required"),
  "Group Name": z.string().min(1, "Group Name is required"),
  "Group ID": z.string().min(1, "Group ID is required"),
  "Division Name": z.string().min(1, "Division Name is required"),
  "Division ID": z.string().min(1, "Division ID is required"),
  Plan: z.string().min(1, "Plan is required"),
  "Plan ID": z.string().min(1, "Plan ID is required"),
  "Place of Service": z.string().min(1, "Place of Service is required"),
  "Claim Type": z.enum(["Professional", "Institutional"]),
  "Procedure Code": z.string().min(1, "Procedure Code is required"),
  "Member Gender": z.string().min(1, "Member Gender is required"),
  "Provider ID": z.string().min(1, "Provider ID is required"),
  "Provider Name": z.string().min(1, "Provider Name is required"),
});

export type UploadTicCsvFormProps = {
  onSubmitted?: VoidFunction;
};

export const UploadTicCsvForm: React.FC<UploadTicCsvFormProps> = (props) => {
  const { onSubmitted } = props;
  const { uploadCsvTicFile } = useTicStore();
  const { control, handleSubmit, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { csvFile: undefined },
  });

  const [rowData, setRowData] = useState<CsvData[]>([]);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDisabled, setIsDeleteDisabled] = useState<boolean>(true);
  const [selectedRowsCount, setSelectedRowsCount] = useState<number>(0);
  const gridApiRef = useRef<GridApi | null>(null);

  const handleFileUpload = useCallback((file: File | null) => {
    if (!file) return;

    Papa.parse<CsvData>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const { data, meta } = result;
        setRowData(data);
        setColumnDefs(
          meta.fields.map((field) => ({
            headerName: field,
            field,
            cellClassRules: {
              "border-red-500": (params: CellClassParams) => {
                const validation = csvValidationSchema.safeParse({ [params.colDef.headerName!]: params.value });
                return !!validation.error.formErrors.fieldErrors[params.colDef.headerName!];
              },
            },
            tooltipValueGetter: (params) => {
              const validation = csvValidationSchema.safeParse({ [params.colDef.headerName!]: params.value });
              return validation.error.formErrors.fieldErrors?.[params.colDef.headerName!];
            },
          })),
        );
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
      },
    });
  }, []);

  const addRow = () => {
    setRowData((prevData) => [...prevData, {} as CsvData]);
  };

  const deleteSelectedRows = useCallback(() => {
    if (gridApiRef.current) {
      const selectedNodes = gridApiRef.current.getSelectedNodes();
      const selectedData = selectedNodes.map((node) => node.data);
      setRowData((prevData) => prevData.filter((row) => !selectedData.includes(row)));
      setSelectedRowsCount(0);
    }
  }, []);

  const handleSelectionChanged = () => {
    if (gridApiRef.current) {
      const selectedNodes = gridApiRef.current.getSelectedNodes();
      setIsDeleteDisabled(selectedNodes.length === 0);
      setSelectedRowsCount(selectedNodes.length);
    }
  };

  const validateRowData = () => {
    setColumnDefs((prevColumnDefs) =>
      prevColumnDefs.map((colDef) => ({
        ...colDef,
        tooltipField: "Group Name",
        cellClassRules: {
          "border-red-500": (params: CellClassParams) => {
            const validation = csvValidationSchema.safeParse({ [params.colDef.headerName!]: params.value });
            return !!validation.error.formErrors.fieldErrors[params.colDef.headerName!];
          },
        },
        tooltipValueGetter: (params) => {
          const validation = csvValidationSchema.safeParse({ [params.colDef.headerName!]: params.value });
          return validation.error.formErrors.fieldErrors?.[params.colDef.headerName!];
        },
      })),
    );
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    validateRowData();
    const errors = rowData.some((row) => !csvValidationSchema.safeParse(row).success);
    if (errors) {
      return alert("Please fix the errors in the CSV data before submitting");
    }

    setIsLoading(true);
    try {
      const csv = Papa.unparse(rowData);
      const blob = new File([csv], data.csvFile.name, { type: "text/csv;charset=utf-8;" });
      await uploadCsvTicFile(blob);
      setRowData([]);
      setColumnDefs([]);
      setIsDeleteDisabled(true);
      setSelectedRowsCount(0);
      onSubmitted();
    } catch {
      alert("Error uploading CSV file");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <Controller
            name="csvFile"
            control={control}
            render={({ field }) => (
              <FileInput
                label="Upload CSV File"
                placeholder="Choose file"
                accept=".csv"
                {...field}
                onChange={(file) => {
                  setValue("csvFile", file);
                  handleFileUpload(file);
                }}
              />
            )}
          />
          <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              gridOptions={{
                rowSelection: {
                  mode: "multiRow",
                },
              }}
              onSelectionChanged={handleSelectionChanged}
              onGridReady={(params) => {
                gridApiRef.current = params.api;
              }}
              defaultColDef={{
                editable: true,
              }}
            />
          </div>
          <Button variant="outline" onClick={addRow} disabled={rowData.length === 0 || isLoading}>
            Add Row
          </Button>
          <Button variant="outline" color="red" onClick={deleteSelectedRows} disabled={isDeleteDisabled || isLoading}>
            Delete Selected Rows {selectedRowsCount > 0 ? `(${selectedRowsCount})` : ""}
          </Button>
          <Button type="submit" disabled={rowData.length === 0} loading={isLoading}>
            Submit
          </Button>
        </Stack>
      </form>
    </>
  );
};

export const UploadTicCsvFormModalButton: React.FC = () => {
  const [opened, setOpened] = useState<boolean>(false);
  const handleClose = () => setOpened(false);
  const handleOpen = () => setOpened(true);
  return (
    <>
      <Button color="indigo" onClick={handleOpen}>Upload CSV</Button>
      <Modal size="80%" opened={opened} onClose={handleClose} title="Upload CSV">
        <UploadTicCsvForm onSubmitted={handleClose} />
      </Modal>
    </>
  );
};
