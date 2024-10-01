import { auth } from "@clerk/nextjs/server";
import { getStudentById } from "@/actions/users";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { errorMessage: "Unauthenticated" },
        { status: 400 }
      );
    }

    const student = await getStudentById(userId);
    if (!student) {
      return NextResponse.json(
        { errorMessage: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(student);
  } catch (error: any) {
    return NextResponse.json(
      { errorMessage: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
