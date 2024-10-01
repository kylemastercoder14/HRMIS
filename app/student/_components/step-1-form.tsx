"use client";

import { fetchFacultiesByFeatures } from "@/actions/faculty";
import CustomFormField from "@/components/custom-formfield";
import SubmitButton from "@/components/submit-button";
import { Form } from "@/components/ui/form";
import { FormFieldType } from "@/lib/constants";
import { Step1Schema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Student } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const Step1Form = ({
  nextStep,
  studentData,
}: {
  nextStep: () => void;
  studentData: Student | null;
}) => {
  const [isPending, setIsPending] = useState(false);
  const [faculties, setFaculties] = useState<
    { fname: string; mname: string | null; lname: string }[]
  >([]);

  useEffect(() => {
    const getFaculties = async () => {
      if (
        studentData?.course &&
        studentData?.yearLevel &&
        studentData?.section
      ) {
        const response = await fetchFacultiesByFeatures(
          studentData.course,
          studentData.yearLevel,
          studentData.section
        );

        if (response?.faculties) {
          setFaculties(response.faculties);
        } else if (response?.error) {
          console.error(response.error);
        }
      }
    };

    getFaculties();
  }, [studentData?.course, studentData?.yearLevel, studentData?.section]);

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
        evaluator: "Student",
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

  const facultyRanks = [
    "Associate Professor I",
    "Associate Professor II",
    "Associate Professor III",
    "Associate Professor IV",
    "Associate Professor V",
    "Assistant Professor I",
    "Assistant Professor II",
    "Assistant Professor III",
    "Assistant Professor IV",
    "Assistant Professor V",
    "COS Faculty",
    "Instructor I",
    "Instructor II",
    "Instructor III",
  ];

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
                faculty.lname + ", " + faculty.fname + " " + faculty.mname
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
            options={facultyRanks}
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
