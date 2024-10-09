"use client";

import CustomFormField from "@/components/custom-formfield";
import SubmitButton from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormFieldType } from "@/lib/constants";
import {
  Step1Schema,
  Step2Schema,
  Step3Schema,
  Step4Schema,
} from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Evaluation } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const Step4Form = ({
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
     ? localStorage.getItem("step4DataUpdate")
     : null;

 const defaultValues = savedData
   ? JSON.parse(savedData)
   : {
    teaching: "",
    enhance: "",
    objectives: "",
    independent: "",
    encourage: "",
     };

  const form = useForm<z.infer<typeof Step4Schema>>({
    resolver: zodResolver(Step4Schema),
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
      localStorage.setItem("step4DataUpdate", JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form, form.watch]);

  useEffect(() => {
    if (evaluationData) {
      form.reset({
        teaching: evaluationData?.teaching || "",
        enhance: evaluationData?.enhance || "",
        objectives: evaluationData?.objectives || "",
        independent: evaluationData?.independent || "",
        encourage: evaluationData?.encourage || "",
      });
    }
  }, [evaluationData, form]);

  const onSubmit = async (values: z.infer<typeof Step4Schema>) => {
    setIsPending(true);
    try {
      localStorage.setItem("step4DataUpdate", JSON.stringify(values));
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
            name="teaching"
            isRequired
            className="w-full"
            fieldType={FormFieldType.RADIO}
            options={["5", "4", "3", "2", "1"]}
            label="Creates teaching strategies that allows students to practice using concepts they need to understand (Interactive discussion)."
            disabled={isPending}
          />
          <CustomFormField
            control={form.control}
            name="enhance"
            isRequired
            className="w-full"
            fieldType={FormFieldType.RADIO}
            options={["5", "4", "3", "2", "1"]}
            label="Enhances students' self-esteem and/or give due recognition to students performance/potentials."
            disabled={isPending}
          />
        </div>

        <div className="field-group-col2 w-full">
          <CustomFormField
            control={form.control}
            name="objectives"
            isRequired
            className="w-full"
            fieldType={FormFieldType.RADIO}
            options={["5", "4", "3", "2", "1"]}
            label="Allows students to create their own course with objectives and realistically-defined student-professor rules & make them accountable for their performance."
            disabled={isPending}
          />
          <CustomFormField
            control={form.control}
            name="independent"
            isRequired
            className="w-full"
            fieldType={FormFieldType.RADIO}
            options={["5", "4", "3", "2", "1"]}
            label="Allows students to think independently and make their own decisions and holding them accountable for their performance based largely on their success in executing decisions."
            disabled={isPending}
          />
        </div>
        <CustomFormField
          control={form.control}
          name="encourage"
          isRequired
          className="w-full"
          fieldType={FormFieldType.RADIO}
          options={["5", "4", "3", "2", "1"]}
          label="Encourages students to learn beyond what is required and help/guide the students how to apply the concepts learned."
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

export default Step4Form;
