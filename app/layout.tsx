import { SpotifyTokenProvider } from '@/app/context/SpotifyTokenContext';

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
}

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
      <html lang="en">
      <body>
      <SpotifyTokenProvider>{children}</SpotifyTokenProvider>
      </body>
      </html>
  )
}