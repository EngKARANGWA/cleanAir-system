import DashboardSidebar from "./components/DashboardSidebar";
import AuthGuard from "./components/AuthGuard";
import PWAInstallModal from "./components/PWAInstallModal";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white flex">
        <DashboardSidebar />
        <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-auto min-h-screen">{children}</main>
      </div>
      <PWAInstallModal />
    </AuthGuard>
  );
}
