import { type FormEvent, useState } from "react";

export type CheckoutAddress = {
  name: string;
  country: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
};

type CheckoutAddressFormProps = {
  title: string;
  description: string;
  submitLabel: string;
  onSubmit: (address: CheckoutAddress) => void;
};

const countryOptions = [
  { code: "US", label: "United States" },
  { code: "CA", label: "Canada" },
  { code: "MX", label: "Mexico" },
  { code: "GB", label: "United Kingdom" },
  { code: "AU", label: "Australia" },
  { code: "NZ", label: "New Zealand" },
  { code: "IE", label: "Ireland" },
  { code: "DE", label: "Germany" },
  { code: "FR", label: "France" },
  { code: "ES", label: "Spain" },
  { code: "IT", label: "Italy" },
  { code: "NL", label: "Netherlands" },
  { code: "PT", label: "Portugal" },
];

const inputClass =
  "min-h-11 rounded-lg border border-white/10 bg-[#0b0b12] px-3 py-2 text-sm font-semibold text-white placeholder:text-white/35 outline-none transition focus:border-landing-green focus:ring-2 focus:ring-landing-green/30";

export default function CheckoutAddressForm({ title, description, submitLabel, onSubmit }: CheckoutAddressFormProps) {
  const [form, setForm] = useState<CheckoutAddress>({
    name: "",
    country: "US",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
  });
  const [error, setError] = useState("");

  const updateField = (field: keyof CheckoutAddress, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (error) {
      setError("");
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedAddress = {
      ...form,
      name: form.name.trim(),
      line1: form.line1.trim(),
      line2: form.line2?.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      postalCode: form.postalCode.trim(),
    };

    if (
      !normalizedAddress.name ||
      !normalizedAddress.country ||
      !normalizedAddress.line1 ||
      !normalizedAddress.city ||
      !normalizedAddress.state ||
      !normalizedAddress.postalCode
    ) {
      setError("Please enter your name, address, city, state, and ZIP code before continuing.");
      return;
    }

    onSubmit(normalizedAddress);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-landing-green/20 bg-[#050807] p-4 shadow-[0_0_24px_rgba(34,197,94,0.12)]"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-landing-green">{title}</p>
        <p className="mt-2 text-sm leading-relaxed text-white/62">{description}</p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="grid gap-1.5 sm:col-span-2">
          <span className="text-xs font-semibold text-white">Full name</span>
          <input
            className={inputClass}
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="John Smith"
            autoComplete="name"
            required
          />
        </label>

        <label className="grid gap-1.5 sm:col-span-2">
          <span className="text-xs font-semibold text-white">Country</span>
          <select
            className={inputClass}
            value={form.country}
            onChange={(event) => updateField("country", event.target.value)}
            autoComplete="country"
            required
          >
            {countryOptions.map((country) => (
              <option key={country.code} value={country.code}>
                {country.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5 sm:col-span-2">
          <span className="text-xs font-semibold text-white">Address Line 1</span>
          <input
            className={inputClass}
            value={form.line1}
            onChange={(event) => updateField("line1", event.target.value)}
            placeholder="123 Main St"
            autoComplete="address-line1"
            required
          />
        </label>

        <label className="grid gap-1.5 sm:col-span-2">
          <span className="text-xs font-semibold text-white">Address Line 2</span>
          <input
            className={inputClass}
            value={form.line2 || ""}
            onChange={(event) => updateField("line2", event.target.value)}
            placeholder="Apt, suite, unit, building"
            autoComplete="address-line2"
          />
        </label>

        <label className="grid gap-1.5">
          <span className="text-xs font-semibold text-white">City</span>
          <input
            className={inputClass}
            value={form.city}
            onChange={(event) => updateField("city", event.target.value)}
            placeholder="Denver"
            autoComplete="address-level2"
            required
          />
        </label>

        <label className="grid gap-1.5">
          <span className="text-xs font-semibold text-white">State</span>
          <input
            className={inputClass}
            value={form.state}
            onChange={(event) => updateField("state", event.target.value)}
            placeholder="CO"
            autoComplete="address-level1"
            required
          />
        </label>

        <label className="grid gap-1.5 sm:col-span-2">
          <span className="text-xs font-semibold text-white">ZIP Code</span>
          <input
            className={inputClass}
            value={form.postalCode}
            onChange={(event) => updateField("postalCode", event.target.value)}
            placeholder="80202"
            autoComplete="postal-code"
            required
          />
        </label>
      </div>

      {error && <p className="mt-3 text-sm font-semibold text-red-300">{error}</p>}

      <button
        type="submit"
        className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-landing-green px-5 py-3 text-sm font-extrabold text-black shadow-[0_0_24px_rgba(34,197,94,0.25)] transition hover:bg-emerald-300 hover:shadow-[0_0_34px_rgba(34,197,94,0.38)] focus:outline-none focus:ring-2 focus:ring-landing-green focus:ring-offset-2 focus:ring-offset-black"
      >
        {submitLabel}
      </button>
    </form>
  );
}
