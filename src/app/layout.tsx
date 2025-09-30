import { AuthProvider } from '@/contexts/AuthContext';
import AdminLayout from '@/components/layout/AdminLayout';
import './globals.css';

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Admin panel for managing the application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>
        <AuthProvider>
          <AdminLayout>
            {children}
          </AdminLayout>
        </AuthProvider>
      </body>
    </html>
  )
}