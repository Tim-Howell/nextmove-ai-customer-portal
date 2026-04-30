import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { getPortalSettings } from "@/app/actions/portal-settings";
import { buildThemeCss } from "@/lib/theme/css-vars";

/**
 * Soft Modernist typography pair:
 *   - Fraunces (variable serif) for display/headings.
 *   - Plus Jakarta Sans (variable sans) for body and UI.
 * Both loaded via next/font/google so there are no CDN calls at request time.
 */
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NextMove AI Customer Portal",
  description: "Customer portal for NextMove AI",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Server-side theme resolution: fetch portal_settings, validate against
  // brand defaults, emit an inline <style> block so the dark theme paints
  // on first render with no FOUC.
  const settings = await getPortalSettings();
  const themeCss = buildThemeCss(settings);

  return (
    <html
      lang="en"
      data-theme="dark"
      className={cn(
        "h-full",
        "antialiased",
        fraunces.variable,
        jakarta.variable,
        "font-sans"
      )}
    >
      <head>
        <style
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: themeCss }}
        />
      </head>
      <body
        className="min-h-full flex flex-col"
        style={{ fontFamily: "var(--font-body), system-ui, sans-serif" }}
      >
        {children}
        <Toaster position="top-right" richColors closeButton theme="dark" />
      </body>
    </html>
  );
}
