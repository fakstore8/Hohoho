import './globals.css'

export const metadata = {
  title: 'Kalkulator Sin Cos Tan - Sistem K Otomatis',
  description: 'Kalkulator trigonometri dengan sistem K otomatis untuk menghitung sin, cos, dan tan',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}