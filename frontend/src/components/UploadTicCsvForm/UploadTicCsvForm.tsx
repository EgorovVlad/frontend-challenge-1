import React, { useState, useCallback, useRef } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FileInput, Stack } from "@mantine/core";
import Papa from "papaparse";
import { AgGridReact, AgGridReactProps } from "ag-grid-react";

import { GridApi, ColDef, CellClassParams } from "ag-grid-community";
import { useTicStore } from "~/stores/tic.store";
import { parseCsvFile } from "~/utils/parse-csv-file.ts";
import { csvValidationSchema, uploadFileSchema } from "~/components/UploadTicCsvForm/validation";

type FormData = z.infer<typeof uploadFileSchema>;
type CsvData = Record<string, string>;

export type UploadTicCsvFormProps = {
  onSubmitted?: VoidFunction;
};

export const UploadTicCsvForm: React.FC<UploadTicCsvFormProps> = (props) => {
  const { onSubmitted } = props;
  const { uploadCsvTicFile } = useTicStore();
  const { control, handleSubmit, setValue } = useForm<FormData>({
    resolver: zodResolver(uploadFileSchema),
    defaultValues: { csvFile: undefined },
  });

  const [rowData, setRowData] = useState<CsvData[]>([]);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRowsCount, setSelectedRowsCount] = useState<number>(0);

  const gridApiRef = useRef<GridApi | null>(null);
  const handleGridReady: AgGridReactProps["onGridReady"] = useCallback((event) => {
    gridApiRef.current = event.api;
  }, []);

  const handleFileUpload = useCallback(
    async (file: File | null) => {
      if (!file) return;

      const parsedCsv = await parseCsvFile(file);
      setValue("csvFile", file);
      setRowData(parsedCsv.table);
      setColumnDefs(
        parsedCsv.fields.map((field) => ({
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
    [setValue],
  );

  const handleAddRow = useCallback(() => {
    setRowData((prevData) => [...prevData, {} as CsvData]);
  }, []);

  const handleDeleteSelectedRows = useCallback(() => {
    const selectedNodes = gridApiRef.current?.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setRowData((prevData) => prevData.filter((row) => !selectedData.includes(row)));
    setSelectedRowsCount(0);
  }, []);

  const handleSelectionChanged = useCallback(() => {
    const selectedNodes = gridApiRef.current?.getSelectedNodes();
    setSelectedRowsCount(selectedNodes.length);
  }, []);

  const handleFormSubmit: SubmitHandler<FormData> = useCallback(
    async (data) => {
      const errors = rowData.some((row) => !csvValidationSchema.safeParse(row).success);
      if (errors) return alert("Please fix the errors in the CSV data before submitting");

      setIsLoading(true);
      try {
        const csv = Papa.unparse(rowData);
        const blob = new File([csv], data.csvFile.name, { type: "text/csv;charset=utf-8;" });
        await uploadCsvTicFile(blob);

        // Reset form state
        setRowData([]);
        setColumnDefs([]);
        setSelectedRowsCount(0);
        setValue("csvFile", undefined);

        // Call the parent callback
        onSubmitted();
      } catch {
        alert("Error uploading CSV file");
      } finally {
        setIsLoading(false);
      }
    },
    [rowData, uploadCsvTicFile, setValue, onSubmitted],
  );

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Stack>
          <Controller
            name="csvFile"
            control={control}
            render={({ field }) => <FileInput label="Upload CSV File" placeholder="Choose file" accept=".csv" {...field} onChange={handleFileUpload} />}
          />
          <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              gridOptions={{ rowSelection: { mode: "multiRow" } }}
              onSelectionChanged={handleSelectionChanged}
              onGridReady={handleGridReady}
              defaultColDef={{ editable: true, tooltipComponentParams: { arrow: true } }}
              tooltipTrigger="focus"
            />
          </div>
          <Button variant="outline" onClick={handleAddRow} disabled={rowData.length === 0 || isLoading}>
            Add Row
          </Button>
          <Button variant="outline" color="red" onClick={handleDeleteSelectedRows} disabled={selectedRowsCount === 0 || isLoading}>
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
