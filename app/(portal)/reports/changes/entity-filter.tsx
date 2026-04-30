"use client";

interface EntityFilterProps {
  value: string;
  options: { value: string; label: string }[];
}

export function EntityFilter({ value, options }: EntityFilterProps) {
  return (
    <select
      className="text-sm border rounded px-2 py-1"
      defaultValue={value}
      onChange={(e) => {
        const url = new URL(window.location.href);
        if (e.target.value) {
          url.searchParams.set("entity", e.target.value);
        } else {
          url.searchParams.delete("entity");
        }
        url.searchParams.delete("page");
        window.location.href = url.toString();
      }}
    >
      <option value="">All Entities</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
