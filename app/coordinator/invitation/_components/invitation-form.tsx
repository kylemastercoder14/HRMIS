"use client";

import { assignFaculty } from "@/actions/faculty";
import { addInvitation } from "@/actions/invitation";
import CustomFormField from "@/components/custom-formfield";
import FileUpload from "@/components/file-upload";
import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormFieldType } from "@/lib/constants";
import { InvitationFormSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Faculty } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const InvitationForm = ({ supervisorId }: { supervisorId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const router = useRouter();

  const form = useForm<z.infer<typeof InvitationFormSchema>>({
    resolver: zodResolver(InvitationFormSchema),
    defaultValues: {
      name: "",
      platform: "",
      file: "",
    },
  });

  async function onSubmit(values: z.infer<typeof InvitationFormSchema>) {
    setIsLoading(true);
    addInvitation(values, supervisorId)
      .then((data) => {
        if (data.success) {
          toast.success(data.success);
          window.location.assign("/supervisor/invitation");
        } else {
          toast.error(data.error);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add Invitation</Button>
        </DialogTrigger>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                placeholder="Enter Title"
                name="name"
                label="Title"
                isRequired
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                placeholder="Enter Platform (e.g. Zoom, Google Meet)"
                name="platform"
                label="Platform"
                isRequired
              />
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="file"
                  disabled={isLoading}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product File</FormLabel>
                      <FormControl>
                        <FileUpload
                          onFileUpload={(url) => field.onChange(url)}
                          defaultValue={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="mt-5">
                {isLoading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
                Save Changes
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InvitationForm;
