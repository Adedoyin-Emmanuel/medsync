import "./globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import { ReduxProvider } from "./store/provider";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Seo from "./components/Seo/Seo";

const font = Poppins({
  subsets: ["latin"],
  weight: "400",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="mytheme" suppressHydrationWarning>
      <Seo />
      <body className={font.className}>
        <Toaster />
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
