import ProfileMainComponent from "@/app/[lng]/profile/ProfileMainComponent/ProfileMainComponent";

export default async function Profile() {
  return (
    <main className=" min-h-[calc(100vh-65px)]  px-4 py-8 md:px-8 bg-default-50/50">
      <ProfileMainComponent />
    </main>
  );
}
