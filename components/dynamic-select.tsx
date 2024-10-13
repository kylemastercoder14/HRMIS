"use client";

import { useTheme } from "next-themes";
import { useMemo, useCallback } from "react";
import { MultiValue } from "react-select";
import CreateableSelect from "react-select/creatable";
import { Button } from "./ui/button";

type Props = {
  onChange: (value?: string[]) => void;
  onCreate?: (value: string) => void;
  options?: { label: string; value: string }[];
  value?: string[] | null | undefined;
  disabled?: boolean;
  placeholder?: string;
};

export const DynamicArraySelect = ({
  value = [],
  onChange,
  disabled,
  onCreate,
  options = [],
  placeholder,
}: Props) => {
  const onSelect = (options: MultiValue<{ label: string; value: string }>) => {
    onChange(options.map((option) => option.value));
  };

  const formattedValue = useMemo(() => {
    return options.filter((option) => value?.includes(option.value));
  }, [options, value]);

  const handleCreate = (inputValue: string) => {
    if (onCreate) {
      onCreate(inputValue);
    }
  };

  const selectAll = useCallback(() => {
    // Select all available options
    onChange(options.map((option) => option.value));
  }, [options, onChange]);

  const { theme } = useTheme();

  return (
    <div className="flex items-center w-full justify-between gap-2">
      <CreateableSelect
        isMulti
        placeholder={placeholder}
        className="text-sm text-white rounded-2xl w-full"
        styles={{
          control: (base) => ({
            ...base,
            borderRadius: "0.5rem",
            borderColor: theme === "dark" ? "#111" : "transparent",
            outline: "none",
            backgroundColor: theme === "dark" ? "#1f1f1f" : "#f3f4f6",
            ":hover": { borderColor: theme === "dark" ? "#111" : "#24ae7c" },
            width: "100%",
            ":focus": {
              borderColor: theme === "dark" ? "#111" : "#24ae7c",
              outline: "none", // Remove the default focus outline
            },
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: theme === "dark" ? "#1f1f1f" : "#ffffff", // Set dropdown menu background color
            width: "100%",
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused
              ? theme === "dark"
                ? "#333"
                : "#24ae7c" // Highlight color when focused
              : theme === "dark"
              ? "#1f1f1f"
              : "#ffffff", // Background color for options
            color: theme === "dark" ? "#ffffff" : "#000000", // Text color
            width: "100%",
          }),
        }}
        value={formattedValue}
        onChange={onSelect}
        options={options}
        onCreateOption={handleCreate}
        isDisabled={disabled}
      />
      {/* Uncomment if you want to add a Select All button */}
      <Button
        type="button"
        onClick={selectAll}
        disabled={disabled || options.length === 0}
        variant="secondary"
        className="flex-shrink-0"
      >
        Select All
      </Button>
    </div>
  );
};
