"use client";

import { createEvaluation } from "@/actions/evaluation";
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
  Student,
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

const StudentEvaluationForm = ({
  studentData,
  answers,
  facultyData,
  evaluationData,
}: {
  studentData: Student | null;
  facultyData: Faculty[];
  evaluationData: EvaluationFeatures | null;
  answers: Answer[];
}) => {
  const [isPending, setIsPending] = useState(false);
  const formattedStartDate = formatDate(
    evaluationData?.startDateTime?.toISOString()
  );
  const formattedEndDate = formatDate(
    evaluationData?.endDateTime?.toISOString()
  );

  const ratingPeriod = `${formattedStartDate} - ${formattedEndDate}`;
  const [selectedFaculty, setSelectedFaculty] = useState<string>("");

  const availableFaculty = facultyData.filter(
    (faculty) =>
      !answers.some(
        (answer) =>
          answer.evaluatee ===
          `${faculty.lname}, ${faculty.fname} ${faculty.mname || ""}`.trim()
      )
  );

  // Define default values, including an empty array for questions
  const form = useForm<z.infer<typeof EvaluationFormSchema>>({
    resolver: zodResolver(EvaluationFormSchema),
    defaultValues: {
      schoolYear: evaluationData?.schoolYear ?? "",
      ratingPeriod: ratingPeriod ?? "",
      semester: evaluationData?.semester ?? "",
      evaluatee: "",
      evaluator: "Student",
      academicRank: "",
      questions:
        evaluationData?.questions.map((question) => ({
          questionId: question.id,
          answer: undefined,
        })) || [],
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (selectedFaculty) {
      const faculty = facultyData.find(
        (f) =>
          `${f.lname}, ${f.fname} ${f.mname || ""}`.trim() === selectedFaculty
      );
      if (faculty) {
        form.setValue("academicRank", faculty.academicRank);
      }
    }
  }, [selectedFaculty, form, facultyData]);

  const onSubmit = async (values: z.infer<typeof EvaluationFormSchema>) => {
    setIsPending(true);
    try {
      const response = await createEvaluation(values);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success(response.message);
        window.location.reload();
      }
    } catch (error) {
      toast.error("Failed to submit evaluation");
      console.log("Failed to submit evaluation", error);
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
          name="schoolYear"
          isRequired
          fieldType={FormFieldType.INPUT}
          label="School Year"
          placeholder="Select School Year"
          disabled
          className="w-full"
        />
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
            fieldType={FormFieldType.SELECT}
            options={availableFaculty.map((faculty) =>
              `${faculty.lname}, ${faculty.fname} ${faculty.mname || ""}`.trim()
            )}
            label="Name of Faculty to be Evaluated"
            placeholder="Select Faculty"
            disabled={isPending}
            className="w-full"
            onValueChange={(value) => setSelectedFaculty(value)}
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
          placeholder="Enter your full name"
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
              .map((question) => (
                <CustomFormField
                  key={question.id}
                  control={form.control}
                  name={`questions.${evaluationData.questions.findIndex(
                    (q) => q.id === question.id
                  )}.answer`} // Ensure correct indexing
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
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending && <Loader2 className="w-4 h-4 mr-2" />}
          Submit Form
        </Button>
      </form>
    </Form>
  );
};

export default StudentEvaluationForm;
