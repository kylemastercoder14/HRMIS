"use client";

import CustomFormField from "@/components/custom-formfield";
import { Form } from "@/components/ui/form";
import { Supervisor } from "@prisma/client";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ProfileUpdateSupervisorSchema } from "@/lib/validators";
import { FormFieldType } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import SubmitButton from "@/components/submit-button";
import { useRouter } from "next/navigation";
import { deleteProfile, updateProfileInfo } from "@/actions/supervisor";
import { toast } from "sonner";
import AlertModal from "@/components/ui/alert-modal";

const UpdateProfileForm = ({ supervisor }: { supervisor: Supervisor }) => {
  const [isPending, setIsPending] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof ProfileUpdateSupervisorSchema>>({
    resolver: zodResolver(ProfileUpdateSupervisorSchema),
    defaultValues: {
      firstName: supervisor.fname ?? "",
      lastName: supervisor.lname ?? "",
      middleInitial: supervisor.mname ?? "",
      suffix: supervisor.suffix ?? "",
      email: supervisor.email ?? "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof ProfileUpdateSupervisorSchema>
  ) => {
    try {
      setIsPending(true);
      const response = await updateProfileInfo(values);
      if (response.error) {
        toast.error(response.error);
      } else {
        window.location.reload();
        toast.success(response.success);
      }
    } catch (error) {
      toast.error("Failed to update profile");
      console.log("Failed to update profile", error);
    } finally {
      setIsPending(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsPending(true);
      const response = await deleteProfile();
      if (response.error) {
        toast.error(response.error);
      } else {
        router.push("/");
        toast.success(response.success);
      }
    } catch (error) {
      toast.error("Something went wrong.");
      console.log(error);
    } finally {
      setIsPending(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={isPending}
        onConfirm={onDelete}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-7 mb-2 gap-3">
            <div className="col-span-2">
              <CustomFormField
                control={form.control}
                name="firstName"
                placeholder="Juan"
                disabled={isPending}
                isRequired
                label="First Name"
                fieldType={FormFieldType.INPUT}
              />
            </div>
            <div className="col-span-2">
              <CustomFormField
                control={form.control}
                name="middleInitial"
                placeholder="Reyes"
                disabled={isPending}
                isRequired={false}
                label="Middle Name"
                fieldType={FormFieldType.INPUT}
              />
            </div>
            <div className="col-span-2">
              <CustomFormField
                control={form.control}
                name="lastName"
                placeholder="Dela Cruz"
                disabled={isPending}
                isRequired
                label="Last Name"
                fieldType={FormFieldType.INPUT}
              />
            </div>
            <div className="col-span-1">
              <CustomFormField
                control={form.control}
                name="suffix"
                placeholder="JR."
                disabled={isPending}
                isRequired={false}
                label="Suffix"
                fieldType={FormFieldType.INPUT}
              />
            </div>
          </div>
          <CustomFormField
            control={form.control}
            label="Email Address"
            placeholder="jdelacruz@gmail.com"
            isRequired
            type="email"
            disabled
            fieldType={FormFieldType.INPUT}
            name="email"
          />
          <div className="flex mt-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <SubmitButton isLoading={isPending}>Save Changes</SubmitButton>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push("/student")}
                disabled={isPending}
              >
                Cancel
              </Button>
            </div>
            <Button
              type="button"
              onClick={() => setOpen(true)}
              disabled={isPending}
              variant="destructive"
            >
              Delete Account
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default UpdateProfileForm;
