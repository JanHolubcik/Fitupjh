import type { Metadata } from "next";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

import enCommon from "@/i18n/locales/en/common.json";
import skCommon from "@/i18n/locales/sk/common.json";

import { AdminTestContent } from "./AdminTestContent";

type PageProps = {
  params: Promise<{ lng: string }>;
};

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { lng } = await params;
  const common = lng === "sk" ? skCommon : enCommon;
  return {
    title: common.adminTest.title,
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

  return <AdminTestContent lng={lng} />;
};

export default Page;
