import { Card, CardContent } from "@/components/ui/card";
import db from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import React from "react";
import ProfileUpdate from "../_components/profile-update";
import UpdateProfileForm from "../_components/update-profile-form";
import ChangePasswordForm from "../_components/change-password-form";
import { getStudentFromCookies } from "@/lib/hooks/use-student";

const Profile = async () => {
  const { userId } = await getStudentFromCookies();
  const student = await db.student.findUnique({
    where: {
      id: userId as string,
    },
  });
  if (!userId || !student) return null;
  return (
    <div className="flex flex-col gap-5 px-10 py-10">
      <Card className="shadow-md">
        <CardContent className="p-5">
          <ProfileUpdate
            image={student?.profile as string}
            fallback={student?.fname.charAt(0) as string}
          />
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardContent className="p-5">
          <UpdateProfileForm student={student} />
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardContent className="p-5">
          <ChangePasswordForm student={student} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
