"use server";

import db from "@/lib/db";
import {
  AssignFormSchema,
  FacultyRegistrationSchema,
  ProfileUpdateFacultySchema,
} from "@/lib/validators";
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

  const { firstName, middleInitial, lastName, suffix, email, password } =
    validatedField.data;

  const hashedPassword = await bcryptjs.hash(password, 10);

  try {
    await db.faculty.create({
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
    suffix,
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
        suffix,
        email,
        category,
        status,
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
