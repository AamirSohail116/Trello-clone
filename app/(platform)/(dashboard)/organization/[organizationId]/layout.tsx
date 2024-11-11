import { startCase } from "lodash";

import OrgControl from "./_components/org-control";
import { auth } from "@clerk/nextjs/server";

export async function generateMetadata() {
  const { orgSlug } = await auth();

  return {
    title: startCase(orgSlug || "organization"),
  };
}

export default function OrganizationIdLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <OrgControl />
      {children}
    </>
  );
}
