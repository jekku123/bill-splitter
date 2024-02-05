import { AuthControl } from '@/components/auth-control';

export default function Home() {
  return (
    <main className="flex min-h-screenitems-center justify-between p-24 flex-col">
      <AuthControl />
    </main>
  );
}
