import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Sun,
  Calculator,
  LayoutDashboard,
  User,
  Menu,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export function Navigation5() {
  return (
    <div className="relative w-full py-10 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-6">
        {/* Floating Navbar Pill */}
        <div className="flex h-16 w-full max-w-4xl items-center justify-between gap-2 rounded-xl border border-neutral-200 bg-white pr-3 shadow-sm dark:border-white/10 dark:bg-[#070A11]/80 dark:backdrop-blur-md">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 pr-6 pl-4 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.3)] group-hover:scale-105 transition">
              <Sun className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-neutral-900 dark:text-white leading-none">
                Sol<span className="text-amber-400">Optimizer</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <NavigationMenu className="static">
              <NavigationMenuList className="gap-2">
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className="flex items-center gap-2 rounded-xl bg-transparent px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
                    href="/estimate"
                  >
                    <Calculator className="h-4 w-4 text-amber-400" />
                    Estimator
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    className="flex items-center gap-2 rounded-xl bg-transparent px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
                    href="/dashboard"
                  >
                    <LayoutDashboard className="h-4 w-4 text-slate-400" />
                    Dashboard
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Action Icons Section */}
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/auth/sign-in">
                <Button
                  variant="ghost"
                  className="rounded-xl text-neutral-600 hover:bg-neutral-100 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white font-medium"
                >
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            </div>
            <Link href="/estimate">
              <Button className="hidden rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 font-bold text-slate-950 hover:brightness-110 shadow-[0_0_14px_rgba(245,158,11,0.25)] md:flex dark:text-slate-950">
                Estimate Now
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>

            {/* Mobile Menu Trigger */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl text-neutral-700 dark:text-neutral-300"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="flex w-[300px] flex-col gap-6 p-6 dark:bg-[#070A11] dark:border-white/10"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.3)]">
                      <Sun className="h-5 w-5" />
                    </div>
                    <span className="text-lg font-extrabold text-neutral-900 dark:text-white">
                      Sol<span className="text-amber-400">Optimizer</span>
                    </span>
                  </div>

                  <div className="flex flex-col gap-4">
                    <Link
                      href="/estimate"
                      className="flex items-center gap-2 text-base font-medium text-neutral-900 dark:text-slate-200"
                    >
                      <Calculator className="h-5 w-5 text-amber-400" />
                      Estimator
                    </Link>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 text-base font-medium text-neutral-900 dark:text-slate-200"
                    >
                      <LayoutDashboard className="h-5 w-5 text-slate-400" />
                      Dashboard
                    </Link>
                    <Link
                      href="/auth/sign-in"
                      className="flex items-center gap-2 text-base font-medium text-neutral-900 dark:text-slate-200"
                    >
                      <User className="h-5 w-5 text-slate-400" />
                      Sign In
                    </Link>
                  </div>

                  <div className="mt-auto flex flex-col gap-3">
                    <Link href="/estimate">
                      <Button className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:brightness-110 font-bold">
                        Estimate Now
                      </Button>
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}