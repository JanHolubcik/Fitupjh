import { DashboardContent } from "./components/DashboardContent";

export default async function Dashboard() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 pt-0 bg-default-50/50">
      <DashboardContent />
    </main>
  );
}
