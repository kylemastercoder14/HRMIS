"use server";

import db from "@/lib/db";
import {
  ChangePasswordSchema,
  EvaluationFormSchema,
  ProfileUpdateSupervisorSchema,
  SupervisorRegistrationSchema,
  UserLoginSchema,
} from "@/lib/validators";
import { clerkClient } from "@clerk/nextjs/server";
import bcryptjs from "bcryptjs";
import { z } from "zod";
import * as jose from "jose";
import { cookies } from "next/headers";
import { getSupervisorFromCookies } from "@/lib/hooks/use-supervisor";

export const createUser = async (
  values: z.infer<typeof SupervisorRegistrationSchema>
) => {
  const validatedField = SupervisorRegistrationSchema.safeParse(values);

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
    department,
    academicRank,
    position,
    dateHired,
  } = validatedField.data;

  const year = new Date().getFullYear().toString().slice(-2);
  const randomNumber = Math.floor(1000 + Math.random() * 9000);

  const employeeId = `${year}-${randomNumber}`;

  try {
    const existingUser = await db.supervisor.findFirst({
      where: {
        email,
      },
    });

    if (existingUser) {
      return { error: "Supervisor already exists" };
    }

    await db.supervisor.create({
      data: {
        fname: firstName,
        mname: middleInitial,
        lname: lastName,
        suffix,
        email,
        password,
        department,
        academicRank,
        employeeId,
        position,
        dateHired,
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
    const user = await db.supervisor.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return { error: "User not found" };
    }

    if(password !== user.password) {
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
  const { user } = await getSupervisorFromCookies();

  if (!user) return { error: "User not found" };

  try {
    // await clerkClient.users.updateUser(user.id, { profileImageID: profile });
    await db.supervisor.update({
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
  const { user } = await getSupervisorFromCookies();

  if (!user) return { error: "User not found" };

  try {
    await db.supervisor.update({
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
    department,
    status,
    position,
    dateHired,
    academicRank,
  } = validatedField.data;

  const { user } = await getSupervisorFromCookies();
  if (!user) return { error: "User not found" };

  try {
    await db.supervisor.update({
      where: {
        id: user.id,
      },
      data: {
        fname: firstName,
        mname: middleInitial,
        lname: lastName,
        suffix,
        email,
        department,
        position,
        dateHired,
        status,
        academicRank,
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
  const { user } = await getSupervisorFromCookies();

  if (!user) return { error: "User not found" };

  try {
    await clerkClient.users.deleteUser(user.id);
    await db.supervisor.delete({
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

  const { newPassword, confirmPassword } = validatedField.data;

  try {
    if (newPassword !== confirmPassword) {
      return { error: "New password and confirm password do not match" };
    }

    await db.supervisor.update({
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
    await db.supervisor.update({
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

export const createEvaluation = async (
  values: z.infer<typeof EvaluationFormSchema>
) => {
  const { userId } = await getSupervisorFromCookies();
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
    semester,
    schoolYear
  } = validatedField.data;

  try {
    const answers = questions.map((question) => ({
      evaluatorId: userId,
      yearLevel: schoolYear,
      evaluatee,
      academicRank,
      evaluator,
      semester,
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
