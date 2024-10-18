"use client";

import { createBulkStudent } from "@/actions/test";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import * as XLSX from "xlsx";

const Test = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [jsonData, setJsonData] = useState("");
  const previewData = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        if (data) {
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const workSheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(workSheet);
          setJsonData(JSON.stringify(json, null, 2));
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  const saveData = () => {
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result;
        if (data) {
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const workSheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(workSheet);
          try {
            await createBulkStudent(json);
            setLoading(false);
          } catch (error) {
            console.log(error);
          }
        }
      };
      reader.readAsBinaryString(file);
    }
  };
  return (
    <div className="p-20">
      <h1>Upload Seeder</h1>
      <div className="flex">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Upload file
        </label>
        <input
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          id="file_input"
          type="file"
          accept=".xls,.xlsx"
          onChange={(e) => {
            if (e.target.files) {
              setFile(e.target.files[0]);
            }
          }}
        />
      </div>
      <Button onClick={previewData}>Preview Data</Button>
      <Button onClick={saveData} variant="outline">
        Save Data
      </Button>
      <pre>{jsonData}</pre>
      <p>{loading && <span>Loading...</span>}</p>
    </div>
  );
};

export default Test;
