import type { Metadata } from 'next';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { SearchProvider } from '@/contexts/SearchContext';
import LayoutWrapper from '@/components/LayoutWrapper';
import './globals.css';

export const metadata: Metadata = {
  title: 'Long Stay — городское медиа',
  description: 'Long Stay — городское медиа о Тбилиси, Батуми и Дубае',
  icons: {
    icon: '/icons/logo.png',
    apple: '/icons/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <LanguageProvider>
          <SearchProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </SearchProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
