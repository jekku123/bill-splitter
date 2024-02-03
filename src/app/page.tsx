import { AuthControl } from '@/components/auth-control';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <AuthControl />
    </main>
  );
}
