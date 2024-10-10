"use server";

import db from "@/lib/db";
import { EvaluationFormSchema } from "@/lib/validators";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

export const createEvaluation = async (
  values: z.infer<typeof EvaluationFormSchema>
) => {
  const { userId } = auth();
  if (!userId) return { error: "User not found" };
  const validatedField = EvaluationFormSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    ratingPeriod,
    evaluatee,
    evaluator,
    academicRank,
    questions,
    comments,
  } = validatedField.data;

  try {
    const answers = questions.map((question) => ({
      evaluatorId: userId, // Use the userId from authentication
      evaluatee,
      academicRank,
      evaluator,
      questionId: question.questionId,
      rating: parseInt(question.answer),
      comments,
    }));

    await db.answer.createMany({
      data: answers,
    });

    return { success: true, message: "Evaluation submitted successfully" };
  } catch (error: any) {
    return {
      error: `Failed to submit evaluation. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const createEvaluationForm = async (formData: any) => {
  const { title, description, startDateTime, endDateTime, categories } =
    formData;

  try {
    await db.evaluation.create({
      data: {
        title,
        description,
        startDateTime: new Date(startDateTime),
        endDateTime: new Date(endDateTime),
        Categories: {
          create: categories.map((category: any) => ({
            title: category.title,
            criteria: category.criteria,
            questions: {
              create: category.questions.map((question: any) => ({
                text: question.text,
              })),
            },
          })),
        },
      },
    });
    return { success: true, message: "Evaluation form created successfully" };
  } catch (error) {
    console.error("Error creating evaluation form:", error);
    return { message: "Error creating evaluation form" };
  }
};

export const getEvaluationById = async (evaluationId: string) => {
  return await db.evaluation.findUnique({
    where: {
      id: evaluationId,
    },
  });
};

export const startEvaluation = async (evaluationId: string) => {
  return await db.evaluation.update({
    where: {
      id: evaluationId,
    },
    data: {
      status: "Starting",
    },
  });
};

export const endEvaluation = async (evaluationId: string) => {
  return await db.evaluation.update({
    where: {
      id: evaluationId,
    },
    data: {
      status: "Closed",
    },
  });
};
