"use client";

import CustomFormField from "@/components/custom-formfield";
import SubmitButton from "@/components/submit-button";
import { Form } from "@/components/ui/form";
import { FormFieldType } from "@/lib/constants";
import { Step1Schema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Evaluation, Faculty } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const Step1Form = ({
  nextStep,
  evaluationData,
}: {
  nextStep: () => void;
  evaluationData?: Evaluation | null;
}) => {
  const [isPending, setIsPending] = useState(false);

  // Check for localStorage data initially
  const savedData =
    typeof window !== "undefined"
      ? localStorage.getItem("step1DataUpdate")
      : null;

  const defaultValues = savedData
    ? JSON.parse(savedData)
    : {
        ratingPeriod: "",
        schoolYear: "",
        evaluatee: "",
        academicRank: "",
        evaluator: "",
      };

  // Initialize the form with data from localStorage if available
  const form = useForm<z.infer<typeof Step1Schema>>({
    resolver: zodResolver(Step1Schema),
    defaultValues,
    mode: "onChange",
  });

  const { isValid } = form.formState;

  useEffect(() => {
    if (savedData) {
      form.reset(JSON.parse(savedData));
    }
  }, [savedData, form.reset, form]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem("step1DataUpdate", JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form, form.watch]);

  useEffect(() => {
    if (evaluationData) {
      form.reset({
        ratingPeriod: evaluationData.ratingPeriod || "",
        schoolYear: evaluationData.schoolYear || "",
        evaluatee: evaluationData.evaluatee || "",
        academicRank: evaluationData.academicRank || "",
        evaluator: evaluationData.evaluator || "",
      });
    }
  }, [evaluationData, form]);

  const onSubmit = async (values: z.infer<typeof Step1Schema>) => {
    setIsPending(true);
    try {
      localStorage.setItem("step1DataUpdate", JSON.stringify(values));
      nextStep();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex mt-5 flex-1 space-y-3 flex-col items-center"
      >
        <div className="field-group-col2 w-full">
          <CustomFormField
            control={form.control}
            name="ratingPeriod"
            isRequired
            fieldType={FormFieldType.SELECT}
            options={["1st Semester", "2nd Semester"]}
            label="Rating Period"
            placeholder="Select Rating Period"
            disabled
            className="w-full"
          />
          <CustomFormField
            control={form.control}
            name="schoolYear"
            isRequired
            fieldType={FormFieldType.SELECT}
            options={["2023 - 2024", "2024 - 2025"]}
            label="School Year"
            placeholder="Select School Year"
            disabled
            className="w-full"
          />
        </div>
        <div className="field-group-col2 w-full">
          <CustomFormField
            control={form.control}
            name="evaluatee"
            isRequired
            fieldType={FormFieldType.INPUT}
            label="Name of Faculty to be Evaluated"
            placeholder="Select Faculty"
            disabled
            className="w-full"
            description="Format: Surname, Full Name (Example: Dela Cruz, Juan)"
          />
          <CustomFormField
            control={form.control}
            name="academicRank"
            isRequired
            fieldType={FormFieldType.INPUT}
            label="Academic Rank of Faculty"
            placeholder="Enter Academic Rank"
            disabled
            className="w-full"
            description="Use Roman Numerals (For Example: Instructor I)"
          />
        </div>
        <CustomFormField
          control={form.control}
          name="evaluator"
          isRequired
          fieldType={FormFieldType.SELECT}
          options={["Peer", "Self"]}
          label="Type of Evaluator"
          placeholder="Select Evaluator"
          disabled
          className="w-full"
        />
        <div className="flex w-full items-center justify-between">
          <SubmitButton
            isDisabled={!isValid || isPending}
            isLoading={isPending}
          >
            Continue
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
};

export default Step1Form;
