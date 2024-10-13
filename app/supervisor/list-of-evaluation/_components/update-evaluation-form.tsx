"use client";

import { createEvaluation, updateEvaluation } from "@/actions/evaluation";
import CustomFormField from "@/components/custom-formfield";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { FormFieldType } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { EvaluationFormSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Answer,
  Category,
  Evaluation,
  Faculty,
  Question,
} from "@prisma/client";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface EvaluationFeatures extends Evaluation {
  category: Category[];
  questions: Question[];
}

const UpdateEvaluationForm = ({
  evaluationData,
  existingEvaluation,
}: {
  evaluationData: EvaluationFeatures | null;
  existingEvaluation: Answer[];
}) => {
  const [isPending, setIsPending] = useState(false);
  const answerIds = existingEvaluation.map(answer => answer.id);

  const form = useForm<z.infer<typeof EvaluationFormSchema>>({
    resolver: zodResolver(EvaluationFormSchema),
    defaultValues: {
      semester: "",
      ratingPeriod: "",
      evaluatee: "",
      evaluator: "",
      academicRank: "",
      questions: [],
      comments: existingEvaluation[0]?.comments || "",
    },
    mode: "onChange",
  });

  // useEffect to update the form values when evaluationData or existingEvaluation changes
  useEffect(() => {
    if (evaluationData && existingEvaluation.length > 0) {
      // Reset form with values from evaluationData and existingEvaluation
      form.reset({
        semester: evaluationData?.semester || "",
        ratingPeriod: `${formatDate(
          evaluationData?.startDateTime.toISOString()
        )} - ${formatDate(evaluationData?.endDateTime.toISOString())}`,
        evaluatee: existingEvaluation[0]?.evaluatee || "",
        evaluator: existingEvaluation[0]?.evaluator || "",
        academicRank: existingEvaluation[0]?.academicRank || "",
        questions:
          evaluationData?.questions.map((question) => {
            const answerObj = existingEvaluation.find(
              (ans) => ans.questionId === question.id
            );
            const answer = answerObj ? (["5", "4", "3", "2", "1"].includes(answerObj.rating.toString()) ? answerObj.rating.toString() as "5" | "4" | "3" | "2" | "1" : undefined) : undefined; // Ensure answer is a valid rating

            return {
              questionId: question.id,
              answer: answer, // Populate the answer correctly
            };
          }) || [],
        comments: existingEvaluation[0]?.comments || "",
      });
    }
  }, [evaluationData, existingEvaluation, form]);

  const onSubmit = async (values: z.infer<typeof EvaluationFormSchema>) => {
    setIsPending(true);
    try {
      const response = await updateEvaluation(values, answerIds);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success(response.message);
        window.location.reload();
      }
    } catch (error) {
      toast.error("Failed to update evaluation");
      console.error("Update error", error);
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
            fieldType={FormFieldType.INPUT}
            label="Rating Period"
            placeholder="Select Rating Period"
            disabled
            className="w-full"
          />
          <CustomFormField
            control={form.control}
            name="semester"
            isRequired
            fieldType={FormFieldType.INPUT}
            label="Semester"
            placeholder="Enter Semester"
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
          />
          <CustomFormField
            control={form.control}
            name="academicRank"
            isRequired
            fieldType={FormFieldType.INPUT}
            label="Academic Rank of Faculty"
            placeholder="Academic Rank"
            disabled
            className="w-full"
          />
        </div>
        <CustomFormField
          control={form.control}
          name="evaluator"
          isRequired
          fieldType={FormFieldType.INPUT}
          label="Type of Evaluator"
          placeholder="Enter Evaluator"
          disabled
          className="w-full"
        />
        <Separator className="my-5" />

        {evaluationData?.category.map((category) => (
          <div key={category.id} className="w-full">
            <p className="font-semibold text-lg">
              {category.title} - {category.criteria}%
            </p>
            {evaluationData?.questions
              .filter((question) => question.categoryId === category.id)
              .map((question, index) => (
                <CustomFormField
                  key={question.id}
                  control={form.control}
                  name={`questions.${index}.answer`}
                  isRequired
                  fieldType={FormFieldType.RADIO}
                  options={["5", "4", "3", "2", "1"]}
                  label={question.text}
                  className="w-full"
                />
              ))}
            <Separator className="my-5" />
          </div>
        ))}
        <CustomFormField
          control={form.control}
          name="comments"
          isRequired={false}
          fieldType={FormFieldType.TEXTAREA}
          label="Comments/Feedbacks/Suggestions"
          placeholder="Enter your comments, feedbacks, and suggestions here"
          disabled={isPending}
          className="w-full"
        />
      </form>
    </Form>
  );
};

export default UpdateEvaluationForm;
