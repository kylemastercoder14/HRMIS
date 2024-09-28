"use client";

import { createEvaluation } from "@/actions/evaluation";
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
  Step5Schema,
  Step6Schema,
} from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const Step6Form = ({ prevStep }: { prevStep: () => void }) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof Step6Schema>>({
    resolver: zodResolver(Step6Schema),
    defaultValues: {
      comments: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof Step6Schema>) => {
    setIsPending(true);
    try {
      const step1Data = JSON.parse(localStorage.getItem("step1Data") || "{}");
      const step2Data = JSON.parse(localStorage.getItem("step2Data") || "{}");
      const step3Data = JSON.parse(localStorage.getItem("step3Data") || "{}");
      const step4Data = JSON.parse(localStorage.getItem("step4Data") || "{}");
      const step5Data = JSON.parse(localStorage.getItem("step5Data") || "{}");

      const finalData = {
        ...step1Data,
        ...step2Data,
        ...step3Data,
        ...step4Data,
        ...step5Data,
        comments: values.comments,
      };

      //   send data to database
      const result = await createEvaluation(finalData);

      if (result.success) {
        window.location.assign("/student");
        toast.success("Evaluation submitted successfully");
        localStorage.removeItem("step1Data");
        localStorage.removeItem("step2Data");
        localStorage.removeItem("step3Data");
        localStorage.removeItem("step4Data");
        localStorage.removeItem("step5Data");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Submission error:", error);
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
        <CustomFormField
          control={form.control}
          name="comments"
          isRequired={false}
          fieldType={FormFieldType.TEXTAREA}
          label="Comments, Suggestions or Feedback"
          placeholder="Enter Comments, Suggestions or Feedback"
          disabled={isPending}
          className="w-full"
        />
        <div className="flex w-full gap-5 items-center justify-between">
          <Button className="w-full" onClick={prevStep} variant="secondary">
            Back
          </Button>
          <SubmitButton isLoading={isPending}>Submit</SubmitButton>
        </div>
      </form>
    </Form>
  );
};

export default Step6Form;
