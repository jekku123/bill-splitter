import Link from "next/link";

export default function MainNav() {
  return (
    <nav className="flex-shrink-0">
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
