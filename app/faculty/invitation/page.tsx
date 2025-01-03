import React from "react";
import db from "@/lib/db";
import Heading from "@/components/heading";
import { format } from "date-fns";
import { InvitationColumn } from "./_components/column";
import InvitationClient from "./_components/client";
import { auth } from "@clerk/nextjs/server";
import { getFacultyFromCookies } from "@/lib/hooks/use-faculty";

const Invitation = async () => {
  const { userId } = await getFacultyFromCookies();
  const facultyId = userId;

  // Fetching invitations with supervisors
  const invitations = await db.invitation.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const faculty = await db.faculty.findUnique({
    where: {
      id: facultyId as string,
    },
  });

  const formattedInvitation: InvitationColumn[] = invitations.map((item) => {
    const facultyName = faculty
      ? `${faculty.fname} ${faculty.lname}`
      : "No Faculty"; // Handle case where faculty is null

    return {
      id: item.id,
      title: item.name,
      platform: item.platform,
      file: item.file,
      statuses: item.status,
      createdAt: format(item.createdAt, "MMMM dd, yyyy"),
      time: format(item.createdAt, "hh:mm a"),
      name: facultyName,
    };
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <Heading
          title={`Invitation Record`}
          description="Welcome to the Invitation Record page, where you can manage and track invitations sent to faculty members for training programs."
        />
      </div>
      <InvitationClient data={formattedInvitation} />
    </div>
  );
};

export default Invitation;
