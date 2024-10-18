"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

type Props = {};

export const createStudent = async (data: any) => {
  try {
    const nonTeaching = await db.nonTeaching.create({
      data: {
        fname: data.fname,
        mname: data.mname,
        lname: data.lname,
        email: data.email,
        password: data.password,
        office: data.office,
        position: data.position,
        status: data.status,
        dateHired: data.dateHired,
        employeeId: data.employeeId,
      },
    });
    revalidatePath("/");
    return nonTeaching;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};

export const createBulkStudent = async (data: any[]) => {
  try {
    for (const user of data) {
      await createStudent(user);
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};
