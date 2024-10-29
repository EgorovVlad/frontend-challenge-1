import React from "react";
import { Table, ScrollArea } from "@mantine/core";
import { TiCFile } from "~/types/tic/types";

export type TicFilesTableProps = {
  files: TiCFile[];
};

export const TicFilesTable: React.FC<TicFilesTableProps> = (props) => {
  const { files } = props;
  return (
    <ScrollArea>
      <Table highlightOnHover className="w-full mt-4 border border-gray-200 rounded-lg shadow-sm">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="p-4">File</th>
            <th className="p-4">Version</th>
            <th className="p-4">Plan</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {files.map((file) => (
            <tr key={file.id} className="hover:bg-gray-100">
              <td className="p-4 border">
                <a href={file.url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
                  {file.id}
                </a>
              </td>
              <td className="p-4 border">{file.data.version}</td>
              <td className="p-4 border">{file.data.plan_name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </ScrollArea>
  );
};
