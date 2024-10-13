"use client";

import {
  DATE_DEFAULT_FORMAT,
  DATE_DISPLAY_FORMAT,
  DATE_YEAR_MIN,
  FormFieldType,
  OPT_LENGTH,
  UploaderType,
} from "@/lib/constants";
import { useState } from "react";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { CalendarIcon, Eye, EyeOff } from "lucide-react";
import HoverEffectWrapper from "./motion/hover-effect-wrapper";
import { InputOTP, InputOTPSlot } from "./ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Textarea } from "./ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Calendar } from "./ui/custom-calendar";
import { format } from "date-fns";
import { DynamicArraySelect } from "./dynamic-select";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

interface CustomProps {
  control: Control<any>;
  fieldType: FormFieldType;
  name: string;
  options?: Array<string>;
  label?: string;
  type?: string | number;
  readOnly?: boolean;
  dynamicOptions?: { label: string; value: string }[];
  onCreate?: (value: string) => void;
  placeholder?: string;
  description?: string | React.ReactNode;
  icon?: React.ReactNode;
  dateFormat?: string;
  showTimeSelect?: boolean;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children?: React.ReactNode;
  isRequired?: boolean;
  className?: string;
  uploaderVar?: UploaderType;
  uploaderName?: string;
  enableAI?: boolean;
  autoFocus?: boolean;
  renderedValue?: string;
  renderSkeleton?: (field: any) => React.ReactNode;
}

const RenderField = ({ field, props }: { field: any; props: CustomProps }) => {
  const {
    fieldType,
    icon,
    placeholder,
    disabled,
    description,
    type,
    readOnly,
    options,
    label,
    dynamicOptions,
    onCreate,
    uploaderVar,
    onValueChange,
    uploaderName,
    enableAI,
    autoFocus,
    renderedValue,
  } = props;

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <>
          <HoverEffectWrapper disabled={disabled}>
            <FormControl>
              <div className="shad-input-outer">
                <Input
                  readOnly={readOnly}
                  type={
                    type === "password" && !showPassword ? "password" : "text"
                  }
                  placeholder={placeholder}
                  disabled={disabled}
                  {...field}
                  className="shad-input"
                  autoFocus={autoFocus}
                  onChange={(event) => {
                    const value =
                      type === "number"
                        ? parseFloat(event.target.value)
                        : event.target.value;
                    field.onChange(value);
                  }}
                />
                {type === "password" && (
                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={toggleShowPassword}
                    className="floating-right-btn"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4 opacity-50" />
                    )}
                  </button>
                )}
              </div>
            </FormControl>
          </HoverEffectWrapper>
          {description && <FormDescription>{description}</FormDescription>}
        </>
      );
    case FormFieldType.OTP_INPUT:
      return (
        <FormControl>
          <InputOTP
            maxLength={OPT_LENGTH}
            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
            {...field}
            className="shad-otp"
          >
            <InputOTPSlot index={0} className="shad-otp-slot" />
            <InputOTPSlot index={1} className="shad-otp-slot" />
            <InputOTPSlot index={2} className="shad-otp-slot" />
            <InputOTPSlot index={3} className="shad-otp-slot" />
            <InputOTPSlot index={4} className="shad-otp-slot" />
            <InputOTPSlot index={5} className="shad-otp-slot" />
          </InputOTP>
        </FormControl>
      );
    case FormFieldType.SELECT:
      return (
        <>
          <HoverEffectWrapper disabled={disabled}>
            <FormControl>
              <Select
                onValueChange={(value) => {
                  field.onChange(value); // Update form field value
                  if (onValueChange) {
                    onValueChange(value); // Custom handler for selected faculty
                  }
                }}
                value={field.value || renderedValue}
              >
                <SelectTrigger
                  disabled={disabled}
                  className={cn(
                    "shad-select-trigger",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>

                <SelectContent>
                  {options &&
                    options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </FormControl>
          </HoverEffectWrapper>
          {description && <FormDescription>{description}</FormDescription>}
        </>
      );
    case FormFieldType.CHECKBOX:
      return (
        <div className="items-top flex space-x-2">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          <div className="grid gap-1.5 leading-none">
            <FormLabel>{label}</FormLabel>
            <FormDescription>{description}</FormDescription>
          </div>
        </div>
      );
    case FormFieldType.RADIO:
      return (
        <FormControl>
          <RadioGroup
            value={field.value}
            onValueChange={field.onChange}
            className="radio-group"
            disabled={disabled}
          >
            {options &&
              options.map((option) => (
                <HoverEffectWrapper key={option} disabled={disabled}>
                  <FormItem className="radio-item">
                    <FormControl>
                      <RadioGroupItem value={option} />
                    </FormControl>
                    <FormLabel
                      className={cn(
                        "!my-auto font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {option}
                    </FormLabel>
                  </FormItem>
                </HoverEffectWrapper>
              ))}
          </RadioGroup>
        </FormControl>
      );
    case FormFieldType.TEXTAREA:
      return (
        <>
          <HoverEffectWrapper disabled={disabled}>
            <FormControl>
              <div className="shad-input-outer">
                <Textarea
                  placeholder={placeholder}
                  disabled={disabled}
                  {...field}
                  className="shad-input"
                  autoFocus={autoFocus}
                  onChange={(event) => {
                    const value =
                      type === "number"
                        ? parseFloat(event.target.value)
                        : event.target.value;
                    field.onChange(value);
                  }}
                />
              </div>
            </FormControl>
          </HoverEffectWrapper>
          {description && <FormDescription>{description}</FormDescription>}
        </>
      );
    case FormFieldType.DATE_PICKER:
      return (
        <>
          <HoverEffectWrapper disabled={disabled}>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "flex w-full pl-2 justify-start font-normal focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed",
                      !field.value && "text-muted-foreground"
                    )}
                    disabled={disabled}
                  >
                    <CalendarIcon className="mr-4 h-4 w-4" />
                    {field.value ? (
                      format(field.value, DATE_DISPLAY_FORMAT)
                    ) : (
                      <span>Select a date</span>
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent align="start" className=" w-auto p-0">
                <Calendar
                  mode="single"
                  captionLayout="dropdown-buttons"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) =>
                    date && field.onChange(format(date, DATE_DEFAULT_FORMAT))
                  }
                  fromYear={DATE_YEAR_MIN}
                  toYear={new Date().getFullYear()}
                />
              </PopoverContent>
            </Popover>
          </HoverEffectWrapper>
          {description && <FormDescription>{description}</FormDescription>}
        </>
      );
    case FormFieldType.DYNAMIC_SELECT:
      return (
        <>
          <HoverEffectWrapper disabled={disabled}>
            <FormControl>
              <DynamicArraySelect
                onChange={field.onChange}
                disabled={disabled}
                placeholder={placeholder}
                options={dynamicOptions}
                onCreate={(value) => onCreate && onCreate(value)}
                value={field.value || []}
              />
            </FormControl>
          </HoverEffectWrapper>
          {description && <FormDescription>{description}</FormDescription>}
        </>
      );
  }
};

const CustomFormField = (props: CustomProps) => {
  const { control, fieldType, label, name, isRequired, className } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <div className="space-y-1">
            {fieldType !== FormFieldType.CHECKBOX && label && (
              <FormLabel>
                {label}
                {isRequired === true ? (
                  <span className="text-red-700 tex-lg"> *</span>
                ) : isRequired === false ? (
                  <span className="text-gray-500 text-xs font-normal ml-2">
                    (Optional)
                  </span>
                ) : (
                  ""
                )}
              </FormLabel>
            )}
            <RenderField field={field} props={props} />
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
