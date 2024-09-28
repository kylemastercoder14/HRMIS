"use client";

import CustomFormField from "@/components/custom-formfield";
import SubmitButton from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormFieldType } from "@/lib/constants";
import { Step1Schema, Step2Schema, Step3Schema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const Step3Form = ({
  nextStep,
  prevStep,
}: {
  nextStep: () => void;
  prevStep: () => void;
}) => {
  const [isPending, setIsPending] = useState(false);

  // Check for localStorage data initially
  const savedData =
    typeof window !== "undefined" ? localStorage.getItem("step3Data") : null;

  const defaultValues = savedData
    ? JSON.parse(savedData)
    : {
        mastery: "",
        draws: "",
        practical: "",
        relevance: "",
        awareness: "",
      };

  const form = useForm<z.infer<typeof Step3Schema>>({
    resolver: zodResolver(Step3Schema),
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    const savedData = localStorage.getItem("step3Data");
    if (savedData) {
      form.reset(JSON.parse(savedData));
    }
  }, [form]);

  const { isValid } = form.formState;

  useEffect(() => {
    if (savedData) {
      form.reset(JSON.parse(savedData));
    }
  }, [savedData, form.reset, form]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem("step3Data", JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form, form.watch]);

  const onSubmit = async (values: z.infer<typeof Step3Schema>) => {
    setIsPending(true);
    try {
      localStorage.setItem("step3Data", JSON.stringify(values));
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
            name="mastery"
            isRequired
            className="w-full"
            fieldType={FormFieldType.RADIO}
            options={["5", "4", "3", "2", "1"]}
            label="Demonstrates mastery of the subject matter (explain the subject matter without relying solely on the prescribed textbook)."
            disabled={isPending}
          />
          <CustomFormField
            control={form.control}
            name="draws"
            isRequired
            className="w-full"
            fieldType={FormFieldType.RADIO}
            options={["5", "4", "3", "2", "1"]}
            label="Draws and share information on the state-of-the-art theory and practice in his/her discipline."
            disabled={isPending}
          />
        </div>

        <div className="field-group-col2 w-full">
          <CustomFormField
            control={form.control}
            name="practical"
            isRequired
            className="w-full"
            fieldType={FormFieldType.RADIO}
            options={["5", "4", "3", "2", "1"]}
            label="Integrates subject to practical circumstances and learning intents/purposes of students."
            disabled={isPending}
          />
          <CustomFormField
            control={form.control}
            name="relevance"
            isRequired
            className="w-full"
            fieldType={FormFieldType.RADIO}
            options={["5", "4", "3", "2", "1"]}
            label="Explain the relevance of present topics to the previous lessons, and relates the subject matter relevant current issues and/or daily life activities."
            disabled={isPending}
          />
        </div>
        <CustomFormField
          control={form.control}
          name="awareness"
          isRequired
          className="w-full"
          fieldType={FormFieldType.RADIO}
          options={["5", "4", "3", "2", "1"]}
          label="Demonstrate up-to-date knowledge and/or awareness on current trends and issues of the subject."
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

export default Step3Form;
