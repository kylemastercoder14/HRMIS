"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TrashIcon, UploadCloud } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { createProfile, removeProfile } from "@/actions/faculty";
import { useDropzone } from "react-dropzone";
import { uploadToS3 } from "@/lib/s3";

const ProfileUpdate = ({
  image,
  fallback,
}: {
  image: string;
  fallback: string;
}) => {
  const [profile, setProfile] = useState<string | null>(image);
  const [uploading, setUploading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: async (acceptedImage) => {
      const image = acceptedImage[0];
      if (image.size > 10 * 1024 * 1024) {
        toast.error("Please upload a smaller image.");
        return;
      }
      setUploading(true);
      try {
        const { url } = await uploadToS3(image, (progress) => {
          console.log(`Upload progress: ${progress}%`);
        });
        await createProfile(url);
        setProfile(url);
        toast.success("Image uploaded successfully!");
      } catch (error) {
        toast.error("Image upload failed.");
        console.log(error);
      } finally {
        setUploading(false);
      }
    },
  });

  const handleRemove = async () => {
    setProfile(null); // Reset profile image
    const response = await removeProfile();
    if (response.error) {
      toast.error(response.error);
    } else {
      toast.success(response.success);
      window.location.reload();
    }
  };

  return (
    <div className="flex items-center gap-5">
      <Avatar className="w-20 h-20">
        <AvatarImage src={profile as string} />
        <AvatarFallback className="text-2xl font-semibold">
          {fallback}
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-3">
        <Button
          variant="default"
          onClick={() => document.getElementById("image-upload")?.click()}
          disabled={uploading}
          {...getRootProps()}
        >
          <UploadCloud className="w-5 h-5 mr-2" />
          {uploading ? "Uploading..." : "Upload"}
        </Button>
        <Button
          variant="destructive"
          onClick={handleRemove}
          disabled={uploading || !profile}
        >
          <TrashIcon className="w-5 h-5 mr-2" />
          Remove
        </Button>
        <input
          {...getInputProps()}
          id="image-upload"
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
};

export default ProfileUpdate;
