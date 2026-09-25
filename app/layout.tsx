export const metadata = {
  title: "Can2 — AI Listing Videos",
  description: "Turn one listing photo into a professional AI walkthrough clip.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
