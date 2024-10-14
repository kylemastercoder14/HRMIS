"use server";

import db from "@/lib/db";
import { ChangePasswordSchema, ProfileUpdateSupervisorSchema, SupervisorRegistrationSchema } from "@/lib/validators";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import bcryptjs from "bcryptjs";
import { z } from "zod";

export const createUser = async (
  values: z.infer<typeof SupervisorRegistrationSchema>,
  clerkId: string
) => {
  const validatedField = SupervisorRegistrationSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { firstName, middleInitial, lastName, suffix, email, password, department, academicRank } =
    validatedField.data;

  const hashedPassword = await bcryptjs.hash(password, 10);

  try {
    await db.supervisor.create({
      data: {
        fname: firstName,
        clerkId,
        mname: middleInitial,
        lname: lastName,
        suffix,
        email,
        password: hashedPassword,
        department,
        academicRank,
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
    await db.supervisor.update({
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
    await db.supervisor.update({
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
  values: z.infer<typeof ProfileUpdateSupervisorSchema>
) => {
  const validatedField = ProfileUpdateSupervisorSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    firstName,
    middleInitial,
    lastName,
    email,
    suffix,
  } = validatedField.data;

  const user = await currentUser();
  if (!user) return { error: "User not found" };

  try {
    await clerkClient.users.updateUser(user.id, {
      firstName,
      lastName,
      signOutOfOtherSessions: true,
    });
    await db.supervisor.update({
      where: {
        clerkId: user.id,
      },
      data: {
        fname: firstName,
        mname: middleInitial,
        lname: lastName,
        suffix,
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
    await db.supervisor.delete({
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

    await db.supervisor.update({
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

    await db.supervisor.update({
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

