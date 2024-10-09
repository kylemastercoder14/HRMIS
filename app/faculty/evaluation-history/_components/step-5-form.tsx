"use client";

import CustomFormField from "@/components/custom-formfield";
import SubmitButton from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormFieldType } from "@/lib/constants";
import { Step5Schema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Evaluation } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const Step5Form = ({
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
      ? localStorage.getItem("step5DataUpdate")
      : null;

  const defaultValues = savedData
    ? JSON.parse(savedData)
    : {
        opportunity: "",
        roles: "",
        experience: "",
        structures: "",
        instructional: "",
      };

  const form = useForm<z.infer<typeof Step5Schema>>({
    resolver: zodResolver(Step5Schema),
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
      localStorage.setItem("step5DataUpdate", JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form, form.watch]);

  useEffect(() => {
    if (evaluationData) {
      form.reset({
        opportunity: evaluationData?.opportunity || "",
        roles: evaluationData?.roles || "",
        experience: evaluationData?.experience || "",
        structures: evaluationData?.structures || "",
        instructional: evaluationData?.instructional || "",
      });
    }
  }, [evaluationData, form]);

  const onSubmit = async (values: z.infer<typeof Step5Schema>) => {
    setIsPending(true);
    try {
      localStorage.setItem("step5DataUpdate", JSON.stringify(values));
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
            name="opportunity"
            isRequired
            className="w-full"
            fieldType={FormFieldType.RADIO}
            options={["5", "4", "3", "2", "1"]}
            label="Creates opportunities for intensive and/or extensive contribution of students in the class activities (e.g. breaks class into dyads, triads, or buzz/task groups)."
            disabled={isPending}
          />
          <CustomFormField
            control={form.control}
            name="roles"
            isRequired
            className="w-full"
            fieldType={FormFieldType.RADIO}
            options={["5", "4", "3", "2", "1"]}
            label="Assumes roles as facilitators, resource person, coach, inquisitor, integrator, referee in drawing students to contribute knowledge and understanding of the concepts at hands."
            disabled={isPending}
          />
        </div>

        <div className="field-group-col2 w-full">
          <CustomFormField
            control={form.control}
            name="experience"
            isRequired
            className="w-full"
            fieldType={FormFieldType.RADIO}
            options={["5", "4", "3", "2", "1"]}
            label="Designs and implements learning conditions and experience that promotes healthy exchange and confrontations."
            disabled={isPending}
          />
          <CustomFormField
            control={form.control}
            name="structures"
            isRequired
            className="w-full"
            fieldType={FormFieldType.RADIO}
            options={["5", "4", "3", "2", "1"]}
            label="Structures/restructures learning and teaching-learning context to enhance attainment of collective learning objectives."
            disabled={isPending}
          />
        </div>
        <CustomFormField
          control={form.control}
          name="instructional"
          isRequired
          className="w-full"
          fieldType={FormFieldType.RADIO}
          options={["5", "4", "3", "2", "1"]}
          label="Use of instructional materials (audio/video materials, field-trips, film-showing, computer-aided instruction, etc.) to reinforce learning processes."
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

export default Step5Form;
