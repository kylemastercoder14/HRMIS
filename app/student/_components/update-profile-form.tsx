"use client";

import CustomFormField from "@/components/custom-formfield";
import { Form } from "@/components/ui/form";
import { Student } from "@prisma/client";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ProfileUpdateSchema } from "@/lib/validators";
import { FormFieldType } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import SubmitButton from "@/components/submit-button";
import { useRouter } from "next/navigation";
import { deleteProfile, updateProfileInfo } from "@/actions/users";
import { toast } from "sonner";
import AlertModal from "@/components/ui/alert-modal";

const UpdateProfileForm = ({ student }: { student: Student }) => {
  const [isPending, setIsPending] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof ProfileUpdateSchema>>({
    resolver: zodResolver(ProfileUpdateSchema),
    defaultValues: {
      firstName: student.fname ?? "",
      lastName: student.lname ?? "",
      middleInitial: student.mname ?? "",
      email: student.email ?? "",
      course: student.course ?? "",
      section: student.section ?? "",
      yearLevel: student.yearLevel ?? "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ProfileUpdateSchema>) => {
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
          <div className="field-group-col3 mb-2">
            <CustomFormField
              control={form.control}
              label="First Name"
              placeholder="Juan"
              isRequired
              disabled={isPending}
              fieldType={FormFieldType.INPUT}
              name="firstName"
            />
            <CustomFormField
              control={form.control}
              label="Middle Name"
              placeholder="Reyes"
              isRequired={false}
              disabled={isPending}
              fieldType={FormFieldType.INPUT}
              name="middleInitial"
            />
            <CustomFormField
              control={form.control}
              label="Last Name"
              placeholder="Dela Cruz"
              isRequired
              disabled={isPending}
              fieldType={FormFieldType.INPUT}
              name="lastName"
            />
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
          <div className="field-group-col3 mt-2">
            <CustomFormField
              control={form.control}
              label="Course"
              placeholder="Enter Your Course"
              isRequired
              disabled={isPending}
              fieldType={FormFieldType.INPUT}
              name="course"
            />
            <CustomFormField
              control={form.control}
              label="Year Level"
              placeholder="Enter Your Year Level"
              isRequired
              disabled={isPending}
              fieldType={FormFieldType.INPUT}
              name="yearLevel"
            />
            <CustomFormField
              control={form.control}
              label="Section"
              placeholder="Enter Your Section"
              isRequired
              disabled={isPending}
              fieldType={FormFieldType.INPUT}
              name="section"
            />
          </div>
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
