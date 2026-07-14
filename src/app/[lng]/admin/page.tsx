import type { Metadata } from "next";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

import enAdmin from "@/i18n/locales/en/admin.json";
import skAdmin from "@/i18n/locales/sk/admin.json";
import { AdminContent } from "./AdminContent";

type PageProps = {
  params: Promise<{ lng: string }>;
};

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { lng } = await params;
  const admin = lng === "sk" ? skAdmin : enAdmin;
  return {
    title: admin.title,
  };
};

const Page = async ({ params }: PageProps) => {
  const { lng } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect(`/${lng}/login`);
  }

  if (session.user.role !== "admin") {
    redirect(`/${lng}/dashboard`);
  }

  return <AdminContent lng={lng} />;
};

export default Page;
