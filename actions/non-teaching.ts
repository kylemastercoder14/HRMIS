"use server";

import db from "@/lib/db";
import { NonTeachingRegistrationSchema } from "@/lib/validators";
import bcryptjs from "bcryptjs";
import { z } from "zod";

export const createUser = async (
  values: z.infer<typeof NonTeachingRegistrationSchema>,
  clerkId: string
) => {
  const validatedField = NonTeachingRegistrationSchema.safeParse(values);

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
    office,
    position,
  } = validatedField.data;

  const hashedPassword = await bcryptjs.hash(password, 10);

  try {
    await db.nonTeaching.create({
      data: {
        fname: firstName,
        clerkId,
        mname: middleInitial,
        lname: lastName,
        suffix,
        email,
        password: hashedPassword,
        office,
        position,
      },
    });
    return { success: "User created successfully" };
  } catch (error: any) {
    return {
      error: `Failed to create user. Please try again. ${error.message || ""}`,
    };
  }
};
