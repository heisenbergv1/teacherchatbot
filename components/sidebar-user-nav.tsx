"use client";

import { ChevronUp } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { guestRegex } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { LoaderIcon } from "./icons";
import { toast } from "./toast";

export function SidebarUserNav({ user }: { user: User }) {
  const router = useRouter();
  const { data, status } = useSession();
  const { setTheme, resolvedTheme } = useTheme();

  const isGuest = guestRegex.test(data?.user?.email ?? "");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {status === "loading" ? (
              <SidebarMenuButton
                className={cn(
                  "h-10 justify-between bg-gradient-to-r from-blue-400 via-teal-400 to-green-400",
                  "text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
                )}
              >
                <div className="flex flex-row gap-2 items-center">
                  <div className="size-6 animate-pulse rounded-full bg-zinc-500/30" />
                  <span className="animate-pulse rounded-md bg-zinc-500/30 text-transparent">
                    Loading auth status
                  </span>
                </div>
                <div className="animate-spin">
                  <LoaderIcon />
                </div>
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton
                className={cn(
                  "h-10 justify-between bg-gradient-to-r from-blue-400 via-teal-400 to-green-400",
                  "text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
                )}
                data-testid="user-nav-button"
              >
                <Image
                  alt={user.email ?? "User Avatar"}
                  className="rounded-full"
                  height={24}
                  src={`https://avatar.vercel.sh/${user.email}`}
                  width={24}
                />
                <span className="truncate">
                  {isGuest ? "🐣 New Kid Here" : user?.email}
                </span>
                <ChevronUp className="ml-auto" />
              </SidebarMenuButton>
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className={cn(
              "w-(--radix-popper-anchor-width) rounded-lg shadow-lg border border-gray-200 p-2",
              "bg-gradient-to-b from-blue-50 via-teal-50 to-green-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600"
            )}
            data-testid="user-nav-menu"
            side="top"
          >
            <DropdownMenuItem
              className="cursor-pointer font-medium rounded-md transition-all duration-200
                        data-[highlighted]:text-white
                        data-[highlighted]:bg-gradient-to-r
                        data-[highlighted]:from-blue-400
                        data-[highlighted]:via-teal-400
                        data-[highlighted]:to-green-400"
              data-testid="user-nav-item-theme"
              onSelect={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            >
              {`Toggle ${resolvedTheme === "light" ? "dark" : "light"} mode`}
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1 border-gray-300 dark:border-gray-600" />

            <DropdownMenuItem asChild data-testid="user-nav-item-auth">
              <button
                className="w-full cursor-pointer font-medium rounded-md px-2 py-1 transition-all duration-200
                          data-[highlighted]:text-white
                          data-[highlighted]:bg-gradient-to-r
                          data-[highlighted]:from-blue-400
                          data-[highlighted]:via-teal-400
                          data-[highlighted]:to-green-400"
                onClick={() => {
                  if (status === "loading") {
                    toast({
                      type: "error",
                      description:
                        "Checking authentication status, please try again!",
                    });
                    return;
                  }

                  if (isGuest) {
                    router.push("/login");
                  } else {
                    signOut({ redirectTo: "/" });
                  }
                }}
                type="button"
              >
                {isGuest ? "Login to your account" : "Sign out"}
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
