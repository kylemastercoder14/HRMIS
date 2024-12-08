"use server";

import db from "@/lib/db";
import { InvitationFormSchema } from "@/lib/validators";
import { z } from "zod";

export const addInvitation = async (
  values: z.infer<typeof InvitationFormSchema>
) => {
  const validatedField = InvitationFormSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { file, name, platform, dateStarted, selectedFaculties, status } =
    validatedField.data;

  try {
    await db.invitation.create({
      data: {
        name,
        platform,
        startDate: dateStarted.toISOString(),
        status,
        faculties: {
          connect: selectedFaculties.map((facultyId: string) => ({
            id: facultyId,
          })),
        },
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

export const updateInvitation = async (
  values: z.infer<typeof InvitationFormSchema>,
  invitationId: string
) => {
  const validatedField = InvitationFormSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { file, name, platform, dateStarted, selectedFaculties, status } =
    validatedField.data;

  try {
    await db.invitation.update({
      data: {
        name,
        platform,
        status,
        startDate: dateStarted.toISOString(),
        faculties: {
          connect: selectedFaculties.map((facultyId: string) => ({
            id: facultyId,
          })),
        },
        file: file,
      },
      where: {
        id: invitationId,
      },
    });
    return { success: "Invitation updated successfully" };
  } catch (error: any) {
    return {
      error: `Failed to update Invitation. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const deleteInvitation = async (invitationId: string) => {
  return await db.invitation.delete({
    where: {
      id: invitationId,
    },
  });
};
