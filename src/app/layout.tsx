import "./globals.css";
export const metadata = {
  title: "Maker Console 01 — Object Lab",
  description: "A procedural industrial design study.",
};
export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
