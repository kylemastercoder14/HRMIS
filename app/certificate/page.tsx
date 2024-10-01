import Certificate from "@/components/certificate";
import React from "react";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const CertificatePage = ({ searchParams }: PageProps) => {
  const name = Array.isArray(searchParams.name)
    ? searchParams.name[0]
    : searchParams.name || "";

  const title = Array.isArray(searchParams.title)
    ? searchParams.title[0]
    : searchParams.title || "";

  const platform = Array.isArray(searchParams.platform)
    ? searchParams.platform[0]
    : searchParams.platform || "";

  const date = Array.isArray(searchParams.date)
    ? searchParams.date[0]
    : searchParams.date || "";

  const time = Array.isArray(searchParams.time)
    ? searchParams.time[0]
    : searchParams.time || "";

  return (
    <Certificate
      name={name}
      title={title}
      platform={platform}
      date={date}
      time={time}
    />
  );
};

export default CertificatePage;
