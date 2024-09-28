"use server";

import db from "@/lib/db";
import { FacultyRegistrationSchema, ProfileUpdateFacultySchema } from "@/lib/validators";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import bcryptjs from "bcryptjs";
import { z } from "zod";

export const createUser = async (
  values: z.infer<typeof FacultyRegistrationSchema>,
  clerkId: string
) => {
  const validatedField = FacultyRegistrationSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { firstName, middleInitial, lastName, email, password } =
    validatedField.data;

  const hashedPassword = await bcryptjs.hash(password, 10);

  try {
    await db.faculty.create({
      data: {
        fname: firstName,
        clerkId,
        mname: middleInitial,
        lname: lastName,
        email,
        password: hashedPassword,
      },
    });
    return { success: "User created successfully" };
  } catch (error: any) {
    return {
      error: `Failed to create user. Please try again. ${error.message || ""}`,
    };
  }
};

export const fetchFaculties = async () => {
  try {
    const result = await db.faculty.findMany({
      select: {
        id: true,
        fname: true,
        mname: true,
        lname: true,
      },
    });
    return { faculties: result };
  } catch (error: any) {
    return {
      error: `Failed to fetch faculties. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const createProfile = async (profile: string) => {
  if (!profile) return { error: "Profile image is required" };
  const user = await currentUser();

  if (!user) return { error: "User not found" };

  try {
    // await clerkClient.users.updateUser(user.id, { profileImageID: profile });
    await db.faculty.update({
      where: {
        clerkId: user.id,
      },
      data: {
        profile,
      },
    });
    return { success: "Profile updated successfully" };
  } catch (error: any) {
    return {
      error: `Failed to update profile. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const removeProfile = async () => {
  const user = await currentUser();

  if (!user) return { error: "User not found" };

  try {
    await db.faculty.update({
      where: {
        clerkId: user.id,
      },
      data: {
        profile: null,
      },
    });
    return { success: "Profile removed successfully" };
  } catch (error: any) {
    return {
      error: `Failed to remove profile. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const updateProfileInfo = async (
  values: z.infer<typeof ProfileUpdateFacultySchema>
) => {
  const validatedField = ProfileUpdateFacultySchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    firstName,
    middleInitial,
    lastName,
    email,
    category,
    status,
  } = validatedField.data;

  const user = await currentUser();
  if (!user) return { error: "User not found" };

  try {
    await clerkClient.users.updateUser(user.id, {
      firstName,
      lastName,
      signOutOfOtherSessions: true,
    });
    await db.faculty.update({
      where: {
        clerkId: user.id,
      },
      data: {
        fname: firstName,
        mname: middleInitial,
        lname: lastName,
        email,
      },
    });
    return { success: "User updated successfully" };
  } catch (error: any) {
    return {
      error: `Failed to update user. Please try again. ${error.message || ""}`,
    };
  }
};

export const deleteProfile = async () => {
  const user = await currentUser();

  if (!user) return { error: "User not found" };

  try {
    await clerkClient.users.deleteUser(user.id);
    await db.faculty.delete({
      where: {
        clerkId: user.id,
      },
    });
    return { success: "User removed successfully" };
  } catch (error: any) {
    return {
      error: `Failed to remove profile. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

