import React from "react";
import db from "@/lib/db";
import Heading from "@/components/heading";
import { format } from "date-fns";
import { InvitationColumn } from "./_components/column";
import InvitationClient from "./_components/client";
import InvitationForm from "./_components/invitation-form";
import { auth } from "@clerk/nextjs/server";

const Invitation = async () => {
  const { userId } = auth();
  const supervisorId = userId;

  // Fetching invitations with supervisors
  const invitations = await db.invitation.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const supervisor = await db.supervisor.findUnique({
    where: {
      clerkId: supervisorId as string,
    },
  });

  const formattedInvitation: InvitationColumn[] = invitations.map((item) => {
    const supervisorName = supervisor
      ? `${supervisor.fname} ${supervisor.mname} ${supervisor.lname}`
      : "No Supervisor"; // Handle case where supervisor is null

    return {
      id: item.id,
      title: item.name,
      platform: item.platform,
      statuses: item.status,
      file: item.file,
      createdAt: format(item.createdAt, "MMMM dd, yyyy"),
      time: format(item.createdAt, "hh:mm a"),
      name: supervisorName, // Use the supervisor name or a fallback
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
