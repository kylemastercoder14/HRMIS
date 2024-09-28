"use client";

import { fetchFaculties } from "@/actions/faculty";
import CustomFormField from "@/components/custom-formfield";
import SubmitButton from "@/components/submit-button";
import { Form } from "@/components/ui/form";
import { FormFieldType } from "@/lib/constants";
import db from "@/lib/db";
import { Step1Schema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Faculty } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const Step1Form = ({ nextStep }: { nextStep: () => void }) => {
  const [isPending, setIsPending] = useState(false);
  const [faculties, setFaculties] = useState<
    { fname: string; mname: string | null; lname: string }[]
  >([]);

  useEffect(() => {
    const getFaculties = async () => {
      const response = await fetchFaculties();
      if (response.faculties) {
        setFaculties(response?.faculties || []);
      }
    };

    getFaculties();
  }, []);

  // Check for localStorage data initially
  const savedData =
    typeof window !== "undefined" ? localStorage.getItem("step1Data") : null;

  const defaultValues = savedData
    ? JSON.parse(savedData)
    : {
        ratingPeriod: "",
        schoolYear: "",
        evaluatee: "",
        academicRank: "",
        evaluator: "Faculty",
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
      localStorage.setItem("step1Data", JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form, form.watch]);

  const onSubmit = async (values: z.infer<typeof Step1Schema>) => {
    setIsPending(true);
    try {
      localStorage.setItem("step1Data", JSON.stringify(values));
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
            disabled={isPending}
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
            disabled={isPending}
            className="w-full"
          />
        </div>
        <div className="field-group-col2 w-full">
          <CustomFormField
            control={form.control}
            name="evaluatee"
            isRequired
            fieldType={FormFieldType.SELECT}
            options={faculties.map(
              (faculty) =>
                faculty.fname + " " + faculty.mname + " " + faculty.lname
            )}
            label="Name of Faculty to be Evaluated"
            placeholder="Select Faculty"
            disabled={isPending}
            className="w-full"
            description="Format: Surname, Full Name (Example: Dela Cruz, Juan)"
          />
          <CustomFormField
            control={form.control}
            name="academicRank"
            isRequired
            fieldType={FormFieldType.SELECT}
            options={["Instructor I", "Professor II"]}
            label="Academic Rank of Faculty"
            placeholder="Select Academic Rank"
            disabled={isPending}
            className="w-full"
            description="Use Roman Numerals (For Example: Instructor I)"
          />
        </div>
        <CustomFormField
          control={form.control}
          name="evaluator"
          isRequired
          fieldType={FormFieldType.INPUT}
          label="Name of Evaluator"
          placeholder="Enter your full name"
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
