import Link from "next/link";

export default function MainNav() {
  return (
    <nav className="flex w-1/3 flex-shrink-0 justify-center bg-slate-500">
      <ul className="flex gap-4">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/groups">Groups</Link>
        </li>
      </ul>
    </nav>
  );
}
