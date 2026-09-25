import "./globals.css";

export const metadata = {
  title: "Can2 — AI Listing Videos",
  description: "Turn one listing photo into a professional AI walkthrough clip.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
