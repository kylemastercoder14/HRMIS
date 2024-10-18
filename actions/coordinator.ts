"use server";

import db from "@/lib/db";
import {
  ProfileUpdateCoordinatorSchema,
  CoordinatorRegistrationSchema,
  ChangePasswordSchema,
  UserLoginSchema,
} from "@/lib/validators";
import bcryptjs from "bcryptjs";
import { z } from "zod";
import * as jose from "jose";
import { cookies } from "next/headers";
import { getCoordinatorFromCookies } from "@/lib/hooks/use-coordinator";

export const createUser = async (
  values: z.infer<typeof CoordinatorRegistrationSchema>,
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

export const loginUser = async (values: z.infer<typeof UserLoginSchema>) => {
  const validatedField = UserLoginSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { email, password } = validatedField.data;

  try {
    const user = await db.coordinator.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return { error: "User not found" };
    }

    // Create JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const alg = "HS256";

    const jwt = await new jose.SignJWT({})
      .setProtectedHeader({ alg })
      .setExpirationTime("72h")
      .setSubject(user.id.toString())
      .sign(secret);

    // Set the cookie with the JWT
    cookies().set("Authorization", jwt, {
      httpOnly: true, // Set to true for security
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 60 * 60 * 24 * 3, // Cookie expiration (3 days in seconds)
      sameSite: "strict", // Adjust according to your needs
      path: "/", // Adjust path as needed
    });

    return { token: jwt };
  } catch (error: any) {
    return {
      error: `Failed to sign in user. Please try again. ${error.message || ""}`,
    };
  }
};

export const logout = async () => {
  cookies().set("Authorization", "", { maxAge: 0, path: "/" });
};

export const createProfile = async (profile: string) => {
  if (!profile) return { error: "Profile image is required" };
  const {userId} = await getCoordinatorFromCookies();

  if (!userId) return { error: "User not found" };

  try {
    // Check if the coordinator record exists
    const existingCoordinator = await db.coordinator.findUnique({
      where: { id: userId },
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
        id: userId,
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
  const {user} = await getCoordinatorFromCookies();

  if (!user) return { error: "User not found" };

  try {
    await db.coordinator.update({
      where: {
        id: user.id,
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

  const {user} = await getCoordinatorFromCookies();
  if (!user) return { error: "User not found" };

  try {
    await db.coordinator.update({
      where: {
        id: user.id,
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
  const {user} = await getCoordinatorFromCookies();

  if (!user) return { error: "User not found" };

  try {
    await db.coordinator.delete({
      where: {
        id: user.id,
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

    await db.coordinator.update({
      where: {
        id: id,
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

export const resetPassword = async (newPassword: string, userId: string) => {
  try {
    await db.coordinator.update({
      where: {
        id: userId,
      },
      data: {
        password: newPassword,
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
