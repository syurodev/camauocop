import '@/app/globals.css'
import '@/app/(fullscreen)/style.css'
import { Noto_Sans } from 'next/font/google'

const noto = Noto_Sans({ subsets: ['vietnamese'], weight: ["300", "400", "500", "600", "700"], style: ["normal", "italic"] })

export const metadata = {
  title: 'Đặc sản',
  description: 'Đặc sản Cà Mau',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={`${noto.className}`}>
        {children}
      </body>
    </html>
  )
}
