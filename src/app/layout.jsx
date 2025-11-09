import "./globals.css";

export const metadata = {
  title: "Renan & Helô",
  description: "Site de casamento de Renan e Heloisa",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/logo/favicon.jpg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Cinzel&family=Quicksand&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
