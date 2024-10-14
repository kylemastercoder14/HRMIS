"use server";

import {
  ChangePasswordSchema,
  ProfileUpdateSchema,
  UserRegistrationSchema,
} from "@/lib/validators";
import { z } from "zod";
import bcryptjs from "bcryptjs";
import db from "@/lib/db";
import { clerkClient, currentUser } from "@clerk/nextjs/server";

export const createUser = async (
  values: z.infer<typeof UserRegistrationSchema>,
  clerkId: string
) => {
  const validatedField = UserRegistrationSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    firstName,
    middleInitial,
    lastName,
    suffix,
    email,
    password,
    section,
    yearLevel,
    course,
  } = validatedField.data;

  const hashedPassword = await bcryptjs.hash(password, 10);

  try {
    await db.student.create({
      data: {
        fname: firstName,
        clerkId,
        mname: middleInitial,
        lname: lastName,
        suffix,
        email,
        password: hashedPassword,
        section,
        yearLevel,
        course,
      },
    });
    return { success: "User created successfully" };
  } catch (error: any) {
    return {
      error: `Failed to create user. Please try again. ${error.message || ""}`,
    };
  }
};

export const createProfile = async (profile: string) => {
  if (!profile) return { error: "Profile image is required" };
  const user = await currentUser();

  if (!user) return { error: "User not found" };

  try {
    // await clerkClient.users.updateUser(user.id, { profileImageID: profile });
    await db.student.update({
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
    await db.student.update({
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
  values: z.infer<typeof ProfileUpdateSchema>
) => {
  const validatedField = ProfileUpdateSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    firstName,
    middleInitial,
    lastName,
    email,
    section,
    yearLevel,
    course,
  } = validatedField.data;

  const user = await currentUser();
  if (!user) return { error: "User not found" };

  try {
    await clerkClient.users.updateUser(user.id, {
      firstName,
      lastName,
      signOutOfOtherSessions: true,
    });
    await db.student.update({
      where: {
        clerkId: user.id,
      },
      data: {
        fname: firstName,
        mname: middleInitial,
        lname: lastName,
        email,
        section,
        yearLevel,
        course,
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
    await db.student.delete({
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

export const getStudentById = async (id: string) => {
  try {
    const student = await db.student.findFirst({
      where: {
        clerkId: id,
      },
    });

    if (!student) {
      return { error: "Student not found" };
    }

    return { student };
  } catch (error: any) {
    return {
      error: `Failed to fetch student. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const deleteStudent = async (id: string) => {
  try {
    await db.student.delete({
      where: {
        id: id,
      },
    });
    return { success: "Student deleted successfully" };
  } catch (error: any) {
    return {
      error: `Failed to delete student. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const changePassword = async (
  values: z.infer<typeof ChangePasswordSchema>,
  id: string
) => {
  const validatedField = ChangePasswordSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {newPassword, confirmPassword } = validatedField.data;

  try {
    if (newPassword !== confirmPassword) {
      return { error: "New password and confirm password do not match" };
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    await db.student.update({
      where: {
        clerkId: id,
      },
      data: {
        password: hashedPassword,
      },
    });

    await clerkClient.users.updateUser(id, {
      password: newPassword,
      signOutOfOtherSessions: true,
    })

    return { success: "Password changed successfully" };
  } catch (error: any) {
    return {
      error: `Failed to change password. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const resetPassword = async (newPassword: string, userId: string) => {
  try {
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    await db.student.update({
      where: {
        clerkId: userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    return { success: "Password changed successfully" };
  } catch (error: any) {
    return {
      error: `Failed to change password. Please try again. ${
        error.message || ""
      }`,
    };
  }
};
