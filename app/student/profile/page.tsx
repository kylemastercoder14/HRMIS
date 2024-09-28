import { Card, CardContent } from "@/components/ui/card";
import db from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";
import ProfileUpdate from "../_components/profile-update";
import UpdateProfileForm from "../_components/update-profile-form";
import ChangePasswordForm from "../_components/change-password-form";

const Profile = async () => {
  const user = await currentUser();
  const student = await db.student.findUnique({
    where: {
      clerkId: user?.id,
    },
  });
  if (!user || !student) return null;
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
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
