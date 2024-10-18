"use server";

import db from "@/lib/db";
import {
  AssignFormSchema,
  ChangePasswordSchema,
  FacultyRegistrationSchema,
  ProfileUpdateFacultySchema,
  UserLoginSchema,
} from "@/lib/validators";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import bcryptjs from "bcryptjs";
import { z } from "zod";
import * as jose from "jose";
import { cookies } from "next/headers";
import { getFacultyFromCookies } from "@/lib/hooks/use-faculty";

export const createUser = async (
  values: z.infer<typeof FacultyRegistrationSchema>
) => {
  const validatedField = FacultyRegistrationSchema.safeParse(values);

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
    status,
    academicRank,
    position,
    dateHired,
  } = validatedField.data;

  const year = new Date().getFullYear().toString().slice(-2);
  const randomNumber = Math.floor(1000 + Math.random() * 9000);

  const employeeId = `${year}-${randomNumber}`;

  try {
    await db.faculty.create({
      data: {
        fname: firstName,
        mname: middleInitial,
        lname: lastName,
        suffix,
        email,
        password,
        department,
        status,
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
    const user = await db.faculty.findFirst({
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

export const fetchFaculties = async () => {
  try {
    const result = await db.faculty.findMany({
      orderBy: {
        lname: "asc",
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

export const fetchFacultyById = async (facultyId: string) => {
  try {
    const result = await db.faculty.findFirst({
      where: {
        id: facultyId,
      },
      select: {
        id: true,
        fname: true,
        mname: true,
        lname: true,
        academicRank: true,
      },
    });
    return { faculty: result };
  } catch (error: any) {
    return {
      error: `Failed to fetch faculty. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const fetchFacultiesByFeatures = async (
  course: string,
  yearLevel: string,
  section: string
) => {
  if (!course && !yearLevel && !section)
    return {
      error: "At least one of course, year level, or section is required",
    };

  try {
    const result = await db.faculty.findMany({
      where: {
        OR: [
          {
            course: {
              has: course, // Checks if the course array contains the specified course
            },
          },
          {
            yearLevel: {
              has: yearLevel, // Checks if the yearLevel array contains the specified yearLevel
            },
          },
          {
            section: {
              has: section, // Checks if the section array contains the specified section
            },
          },
        ],
      },
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
  const { user } = await getFacultyFromCookies();

  if (!user) return { error: "User not found" };

  try {
    // await clerkClient.users.updateUser(user.id, { profileImageID: profile });
    await db.faculty.update({
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
  const { user } = await getFacultyFromCookies();

  try {
    await db.faculty.update({
      where: {
        id: user?.id,
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
    suffix,
    department,
    academicRank,
    status,
    position,
    dateHired
  } = validatedField.data;

  const { user } = await getFacultyFromCookies();
  if (!user) return { error: "User not found" };

  try {
    await db.faculty.update({
      where: {
        id: user.id,
      },
      data: {
        fname: firstName,
        mname: middleInitial,
        lname: lastName,
        suffix,
        email,
        academicRank,
        department,
        status,
        position,
        dateHired
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
  const { user } = await getFacultyFromCookies();

  if (!user) return { error: "User not found" };

  try {
    await clerkClient.users.deleteUser(user.id);
    await db.faculty.delete({
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

export const assignFaculty = async (
  facultyId: string,
  values: z.infer<typeof AssignFormSchema>
) => {
  const validatedField = AssignFormSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { faculty, yearLevel, course, section } = validatedField.data;

  try {
    await db.faculty.update({
      where: {
        id: facultyId,
      },
      data: {
        yearLevel,
        course,
        section,
      },
    });
    return { success: "Faculty assigned successfully" };
  } catch (error: any) {
    return {
      error: `Failed to assign faculty. Please try again. ${
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

    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    await db.faculty.update({
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
    await db.faculty.update({
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
