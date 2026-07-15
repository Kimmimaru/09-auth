import { NextResponse, type NextRequest } from "next/server";
import { checkSession } from "@/lib/api/serverApi";

const privateRoutes = ["/notes", "/profile"];
const publicRoutes = ["/sign-in", "/sign-up"];

const isMatchedRoute = (pathname: string, routes: string[]) => {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
};

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPrivateRoute = isMatchedRoute(pathname, privateRoutes);
  const isPublicRoute = isMatchedRoute(pathname, publicRoutes);

  if (!isPrivateRoute && !isPublicRoute) {
    return NextResponse.next();
  }

  const cookieHeader = req.headers.get("cookie") ?? "";
  const isAuthenticated = await checkSession(cookieHeader);

  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/notes/:path*", "/profile/:path*", "/sign-in", "/sign-up"],
};
