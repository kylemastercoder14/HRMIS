"use server";

import db from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export const createEvaluation = async (evaluationData: any) => {
  const user = await currentUser();
  if (!user) {
    return { message: "Unauthenticated" };
  }

  try {
    await db.evaluation.create({
      data: {
        ...evaluationData,
        studentId: user.id,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error creating evaluation:", error);
    return { message: "Error creating evaluation" };
  }
};
