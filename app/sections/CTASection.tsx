import Link from "next/link";

export default function CTASection() {
  return (
    <section className="px-8 py-20 text-center">
      <div className="max-w-2xl mx-auto bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-600/20 dark:to-green-600/20 border border-blue-200 dark:border-blue-500/30 rounded-2xl p-12">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Ready to Monitor Emissions?</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Access the real-time dashboard to view live CO readings, purification
          status, and historical data.
        </p>
        <Link
          href="/dashboard"
          className="bg-blue-500 hover:bg-blue-400 text-white px-10 py-3 rounded-xl font-semibold text-lg transition-colors"
        >
          Open Dashboard
        </Link>
      </div>
    </section>
  );
}
