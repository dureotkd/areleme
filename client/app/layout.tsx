import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  description: '부동산 매물알림,AI분석 등을 제공하는 부동산 정보 제공 사이트',
  title: '부동산알리미 - 3대 플랫폼 알림을 한번에',
  keywords:
    '부동산알리미,부동산,아파트,빌라,주택,토지,상가,사무실,월세,시세,매매,전세,직거래,네이버부동산,실거래,공인중개사,매물,중개,실거래가,알림,다방,직방',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <meta charSet="utf-8"></meta>
      <meta property="og:title" content="부동산알리미 - 3대 플랫폼 알림을 한번에"></meta>
      <meta property="og:url" content="https://www.areleme.com"></meta>
      <meta property="og:site_name" content="부동산알리미 - 3대 플랫폼 알림을 한번에"></meta>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="mx-auto max-w-[540px] shadow-lg h-full min-h-screen text-center flex flex-col items-center justify-center relative">
          {children}
        </div>
      </body>
    </html>
  );
}
