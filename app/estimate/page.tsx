import WizardShell from "@/components/estimator/WizardShell";

export const metadata = {
  title: "Solar Potential Estimator | SolOptimizer",
  description: "Evaluate your roof for solar feasibility, capacity, savings, and payback.",
};

export default function EstimatePage() {
  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <WizardShell />
    </main>
  );
}
