import { Card, CardContent } from "@/components/ui/card";
import db from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";
import ProfileUpdate from "../_components/profile-update";
import UpdateProfileForm from "../_components/update-profile-form";
import ChangePasswordForm from "../_components/change-password-form";

const Profile = async () => {
  const user = await currentUser();
  const supervisor = await db.supervisor.findUnique({
    where: {
      clerkId: user?.id,
    },
  });
  if (!user || !supervisor) return null;
  return (
    <div className="flex flex-col gap-5 px-10 py-10">
      <Card className="shadow-md">
        <CardContent className="p-5">
          <ProfileUpdate
            image={supervisor?.profile as string}
            fallback={supervisor?.fname.charAt(0) as string}
          />
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardContent className="p-5">
          <UpdateProfileForm supervisor={supervisor} />
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardContent className="p-5">
          <ChangePasswordForm supervisor={supervisor} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
