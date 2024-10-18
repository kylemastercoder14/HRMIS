"use server";

import db from "@/lib/db";
import { NonTeachingRegistrationSchema, UserLoginSchema } from "@/lib/validators";
import { z } from "zod";
import * as jose from "jose";
import { cookies } from "next/headers";

export const createUser = async (
  values: z.infer<typeof NonTeachingRegistrationSchema>,
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
    dateHired
  } = validatedField.data;

  const year = new Date().getFullYear().toString().slice(-2);
  const randomNumber = Math.floor(1000 + Math.random() * 9000);

  const employeeId = `${year}-${randomNumber}`;

  try {
    await db.nonTeaching.create({
      data: {
        fname: firstName,
        mname: middleInitial,
        lname: lastName,
        suffix,
        email,
        password,
        office,
        status: "Non-Teaching",
        position,
        dateHired,
        employeeId,
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
    const user = await db.nonTeaching.findFirst({
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
