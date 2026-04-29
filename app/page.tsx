import BrandKit from "@/components/brand-kit";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fafafa]">

      <header className="mx-auto max-w-5xl px-6 pt-24 pb-16 text-center">

        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <img
            src="/imports/logo-base.webp"
            alt="MEDGm Logo"
            className="h-6 w-auto"
          />
        </div>

        {/* EYEBROW */}
        <p className="text-[10px] tracking-[0.3em] text-[#32b5a4] uppercase">
          MEDGm
        </p>

        {/* TITLE */}
        <h1 className="mt-4 text-5xl font-extrabold tracking-tight text-gray-900">
          Brand Kit
        </h1>

        {/* DESCRIPTION */}
        <p className="mx-auto mt-4 max-w-xl text-gray-500">
          Official logo system & brand assets
        </p>

        {/* DIVIDER */}
        <div className="mx-auto mt-8 h-[2px] w-12 bg-[#c6a673]" />

      </header>

      {/* BRAND KIT (todo vive aquí) */}
      <section className="pb-24">
        <BrandKit />
      </section>

      <footer className="mt-20 bg-[#0a0a0a] py-10">
        <div className="text-center text-xs tracking-[0.2em] text-gray-400">
          <span className="text-[#32b5a4] font-medium">MEDGm</span>{" "}
          <span>Brand Kit</span>
          <span className="mx-2">·</span>
          <span>v2.0</span>
          <span className="mx-2">·</span>
          <span>2026</span>
          <span className="mx-2">·</span>
          <span>All assets official and approved</span>
        </div>
      </footer>

    </main>
  );
}