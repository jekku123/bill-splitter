"use client";

import { githubLogin } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { useFormStatus } from "react-dom";
import { Icons } from "../icons";
import { Button } from "./button";

export default function GitHubLogin() {
  const { pending } = useFormStatus();

  return (
    <form action={githubLogin}>
      <Button
        variant="outline"
        className="w-full"
        disabled={pending}
        aria-disabled={pending}
      >
        <Icons.gitHub
          className={cn("mr-2 h-4 w-4", pending && "animate-spin")}
        />
        Github
      </Button>
    </form>
  );
}
