export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Apple-style soft-light atmosphere: two very low-opacity tinted
          washes behind the auth card. Pointer-events-none so they never
          trap clicks. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      </div>
      <div className="w-full max-w-md px-4">{children}</div>
    </div>
  );
}
