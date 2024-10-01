"use server";

import db from "@/lib/db";
import { InvitationFormSchema } from "@/lib/validators";
import { z } from "zod";

export const addInvitation = async (
  values: z.infer<typeof InvitationFormSchema>,
  supervisorId: string
) => {
  const validatedField = InvitationFormSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { file, name, platform } = validatedField.data;

  try {
    await db.invitation.create({
      data: {
        name,
        platform,
        supervisorId: supervisorId,
        file: file,
      },
    });
    return { success: "Invitation created successfully" };
  } catch (error: any) {
    return {
      error: `Failed to create Invitation. Please try again. ${
        error.message || ""
      }`,
    };
  }
};
