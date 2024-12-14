"use client";

import CustomFormField from "@/components/custom-formfield";
import { Form } from "@/components/ui/form";
import { Faculty, Student } from "@prisma/client";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ProfileUpdateFacultySchema } from "@/lib/validators";
import { FormFieldType } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import SubmitButton from "@/components/submit-button";
import { useRouter } from "next/navigation";
import { deleteProfile, updateProfileInfo } from "@/actions/faculty";
import { toast } from "sonner";
import AlertModal from "@/components/ui/alert-modal";

const UpdateProfileForm = ({ faculty }: { faculty: Faculty }) => {
  const [isPending, setIsPending] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof ProfileUpdateFacultySchema>>({
    resolver: zodResolver(ProfileUpdateFacultySchema),
    defaultValues: {
      firstName: faculty.fname ?? "",
      lastName: faculty.lname ?? "",
      middleInitial: faculty.mname ?? "",
      suffix: faculty.suffix ?? "",
      email: faculty.email ?? "",
      department: faculty.department ?? "",
      academicRank: faculty.academicRank ?? "",
      status: faculty.status ?? "",
      position: faculty.position ?? "",
      dateHired: faculty.dateHired ?? "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof ProfileUpdateFacultySchema>
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

  const facultyRanks = [
    "Associate Professor I",
    "Associate Professor II",
    "Associate Professor III",
    "Associate Professor IV",
    "Associate Professor V",
    "Assistant Professor I",
    "Assistant Professor II",
    "Assistant Professor III",
    "Assistant Professor IV",
    "Assistant Professor V",
    "COS Faculty",
    "Instructor I",
    "Instructor II",
    "Instructor III",
    "Professor",
    "Professor I",
    "Professor II",
    "Professor III",
    "Professor IV",
  ];

  const department = [
    "College of Criminology",
    "College of Education",
    "College of Industrial Technology",
    "College of Information Technology",
    "College of BSES and BSAF Program",
  ];

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
          <div className="field-group-col2 mt-2 mb-2">
            <CustomFormField
              control={form.control}
              label="Department"
              placeholder="Select Your Department"
              isRequired
              options={department}
              disabled={isPending}
              fieldType={FormFieldType.SELECT}
              name="department"
            />
            <CustomFormField
              control={form.control}
              label="Status"
              placeholder="Select Your Status"
              isRequired
              options={["COS", "Regular"]}
              disabled={isPending}
              fieldType={FormFieldType.SELECT}
              name="status"
            />
          </div>
          <CustomFormField
            control={form.control}
            label="Academic Rank"
            placeholder="Select Your Academic Rank"
            isRequired
            options={facultyRanks}
            disabled={isPending}
            fieldType={FormFieldType.SELECT}
            name="academicRank"
          />
          <div className="field-group-col2 mt-2 mb-2">
            <CustomFormField
              control={form.control}
              label="Position"
              placeholder="Select Your Position"
              isRequired
              options={["Teaching", "Chairperson"]}
              disabled={isPending}
              fieldType={FormFieldType.SELECT}
              name="position"
            />
            <CustomFormField
              control={form.control}
              name="dateHired"
              placeholder="Enter Date Hired"
              disabled={isPending}
              isRequired
              label="Date Hired"
              fieldType={FormFieldType.DATE_PICKER}
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
