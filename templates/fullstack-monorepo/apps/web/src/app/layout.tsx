import type { Metadata } from 'next';
import { TRPCProvider } from '@/components/TRPCProvider';
import './globals.css';

export const metadata: Metadata = {
  title: '{{DISPLAY_NAME}}',
  description: 'Fullstack Monorepo App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
