"use client";

import CustomFormField from "@/components/custom-formfield";
import SubmitButton from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormFieldType } from "@/lib/constants";
import { Step1Schema, Step2Schema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Evaluation } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const Step2Form = ({
  nextStep,
  prevStep,
  evaluationData,
}: {
  nextStep: () => void;
  prevStep: () => void;
  evaluationData?: Evaluation | null;
}) => {
  const [isPending, setIsPending] = useState(false);

  // Check for localStorage data initially
  const savedData =
    typeof window !== "undefined"
      ? localStorage.getItem("step2DataUpdate")
      : null;

  const defaultValues = savedData
    ? JSON.parse(savedData)
    : {
        demonstrate: "",
        integrate: "",
        available: "",
        regularly: "",
        accurate: "",
      };

  const form = useForm<z.infer<typeof Step2Schema>>({
    resolver: zodResolver(Step2Schema),
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
      localStorage.setItem("step2DataUpdate", JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form, form.watch]);

  useEffect(() => {
    if (evaluationData) {
      form.reset({
        demonstrate: evaluationData?.demonstrate || "",
        integrate: evaluationData?.integrate || "",
        available: evaluationData?.available || "",
        regularly: evaluationData?.regularly || "",
        accurate: evaluationData?.accurate || "",
      });
    }
  }, [evaluationData, form]);

  const onSubmit = async (values: z.infer<typeof Step2Schema>) => {
    setIsPending(true);
    try {
      localStorage.setItem("step2DataUpdate", JSON.stringify(values));
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
            name="demonstrate"
            isRequired
            className="w-full"
            fieldType={FormFieldType.RADIO}
            options={["5", "4", "3", "2", "1"]}
            label="Demonstrates sensitivity to students' ability to attend and absorb content information."
            disabled={isPending}
          />
          <CustomFormField
            control={form.control}
            name="integrate"
            isRequired
            className="w-full"
            fieldType={FormFieldType.RADIO}
            options={["5", "4", "3", "2", "1"]}
            label="Integrate sensitivity his/her learning objectives with those of the students in a collaborative process."
            disabled={isPending}
          />
        </div>

        <div className="field-group-col2 w-full">
          <CustomFormField
            control={form.control}
            name="available"
            isRequired
            className="w-full"
            fieldType={FormFieldType.RADIO}
            options={["5", "4", "3", "2", "1"]}
            label="Makes self-available to students beyond official time."
            disabled={isPending}
          />
          <CustomFormField
            control={form.control}
            name="regularly"
            isRequired
            className="w-full"
            fieldType={FormFieldType.RADIO}
            options={["5", "4", "3", "2", "1"]}
            label="Regularly comes to class on time, well-groomed, and well-prepared to complete assigned responsibilities."
            disabled={isPending}
          />
        </div>
        <CustomFormField
          control={form.control}
          name="accurate"
          isRequired
          className="w-full"
          fieldType={FormFieldType.RADIO}
          options={["5", "4", "3", "2", "1"]}
          label="Keeps accurate records of the students'performance and prompts submission of the same."
          disabled={isPending}
        />
        <div className="flex w-full gap-5 items-center justify-between">
          <Button className="w-full" onClick={prevStep} variant="secondary">
            Back
          </Button>
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

export default Step2Form;
