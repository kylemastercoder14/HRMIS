"use server";

import db from "@/lib/db";
import {
  ProfileUpdateCoordinatorSchema,
  CoordinatorRegistrationSchema,
} from "@/lib/validators";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import bcryptjs from "bcryptjs";
import { z } from "zod";

export const createUser = async (
  values: z.infer<typeof CoordinatorRegistrationSchema>,
  clerkId: string
) => {
  const validatedField = CoordinatorRegistrationSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { firstName, middleInitial, lastName, suffix, email, password } =
    validatedField.data;

  const hashedPassword = await bcryptjs.hash(password, 10);

  try {
    await db.coordinator.create({
      data: {
        fname: firstName,
        clerkId,
        mname: middleInitial,
        lname: lastName,
        suffix,
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

export const createProfile = async (profile: string) => {
  if (!profile) return { error: "Profile image is required" };
  const { userId } = auth();

  if (!userId) return { error: "User not found" };

  try {
    // Check if the coordinator record exists
    const existingCoordinator = await db.coordinator.findUnique({
      where: { clerkId: userId },
    });

    if (!existingCoordinator) {
      return {
        error:
          "Coordinator profile not found. Please ensure you are registered as a coordinator.",
      };
    }

    // Update the profile if the record exists
    await db.coordinator.update({
      where: {
        clerkId: userId,
      },
      data: {
        profile,
      },
    });

    return { success: "Profile updated successfully" };
  } catch (error: any) {
    console.error("Error updating profile:", error); // Log the error
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
    await db.coordinator.update({
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
  values: z.infer<typeof ProfileUpdateCoordinatorSchema>
) => {
  const validatedField = ProfileUpdateCoordinatorSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { firstName, middleInitial, lastName, email, suffix } =
    validatedField.data;

  const user = await currentUser();
  if (!user) return { error: "User not found" };

  try {
    await clerkClient.users.updateUser(user.id, {
      firstName,
      lastName,
      signOutOfOtherSessions: true,
    });
    await db.coordinator.update({
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
    await db.coordinator.delete({
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
