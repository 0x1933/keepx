import { AppNav } from "@/components/app/app-nav";
import { RangeApp } from "@/components/app/range-app";
import { Footer } from "@/components/footer";

export default function AppPage() {
  return (
    <main className="app-shell">
      <AppNav />
      <RangeApp />
      <Footer />
    </main>
  );
}
