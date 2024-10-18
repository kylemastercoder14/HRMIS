import { Card, CardContent } from "@/components/ui/card";
import db from "@/lib/db";
import React from "react";
import ProfileUpdate from "../_components/profile-update";
import UpdateProfileForm from "../_components/update-profile-form";
import ChangePasswordForm from "../_components/change-password-form";
import { getFacultyFromCookies } from "@/lib/hooks/use-faculty";

const Profile = async () => {
  const {userId} = await getFacultyFromCookies();
  const faculty = await db.faculty.findUnique({
    where: {
      id: userId as string,
    },
  });
  if (!userId || !faculty) return null;
  return (
    <div className="flex flex-col gap-5 px-10 py-10">
      <Card className="shadow-md">
        <CardContent className="p-5">
          <ProfileUpdate
            image={faculty?.profile as string}
            fallback={faculty?.fname.charAt(0) as string}
          />
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardContent className="p-5">
          <UpdateProfileForm faculty={faculty} />
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardContent className="p-5">
          <ChangePasswordForm faculty={faculty} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
