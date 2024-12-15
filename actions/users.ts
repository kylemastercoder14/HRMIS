"use server";

import {
  ChangePasswordSchema,
  ProfileUpdateSchema,
  UserLoginSchema,
  UserRegistrationSchema,
} from "@/lib/validators";
import { z } from "zod";
import bcryptjs from "bcryptjs";
import db from "@/lib/db";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import * as jose from "jose";
import { cookies } from "next/headers";
import { getStudentFromCookies } from "@/lib/hooks/use-student";

export const createUser = async (
  values: z.infer<typeof UserRegistrationSchema>
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

  try {
    const existingUser = await db.student.findFirst({
      where: {
        email,
      },
    });

    if (existingUser) {
      return { error: "Student already exists" };
    }

    await db.student.create({
      data: {
        fname: firstName,
        mname: middleInitial,
        lname: lastName,
        suffix,
        email,
        password,
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

export const loginUser = async (values: z.infer<typeof UserLoginSchema>) => {
  const validatedField = UserLoginSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { email, password } = validatedField.data;

  try {
    const user = await db.student.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return { error: "User not found" };
    }

    if (password !== user.password) {
      return { error: "Invalid password" };
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
  const { user } = await getStudentFromCookies();

  if (!user) return { error: "User not found" };

  try {
    await db.student.update({
      where: {
        id: user.id,
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
  const { user } = await getStudentFromCookies();

  if (!user) return { error: "User not found" };

  try {
    await db.student.update({
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

  const { user } = await getStudentFromCookies();
  if (!user) return { error: "User not found" };

  try {
    await db.student.update({
      where: {
        id: user.id,
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
  const { user } = await getStudentFromCookies();

  if (!user) return { error: "User not found" };

  try {
    await clerkClient.users.deleteUser(user.id);
    await db.student.delete({
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

export const getStudentById = async (id: string) => {
  try {
    const student = await db.student.findFirst({
      where: {
        id: id,
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

  const { newPassword, confirmPassword } = validatedField.data;

  try {
    if (newPassword !== confirmPassword) {
      return { error: "New password and confirm password do not match" };
    }

    await db.student.update({
      where: {
        id: id,
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

export const resetPassword = async (newPassword: string, userId: string) => {
  try {
    await db.student.update({
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
