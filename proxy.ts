import { NextResponse, type NextRequest } from "next/server";
import { parseSetCookie } from "cookie";
import { checkSession } from "@/lib/api/serverApi";

const privateRoutes = ["/notes", "/profile"];
const publicRoutes = ["/sign-in", "/sign-up"];

const isMatchedRoute = (pathname: string, routes: string[]) => {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
};

const applySetCookie = (
  response: NextResponse,
  setCookieHeader: string | string[] | undefined,
) => {
  if (!setCookieHeader) {
    return;
  }

  const cookieArray = Array.isArray(setCookieHeader)
    ? setCookieHeader
    : [setCookieHeader];

  for (const cookieStr of cookieArray) {
    const parsedCookie = parseSetCookie(cookieStr);

    if (parsedCookie.value) {
      response.cookies.set(parsedCookie.name, parsedCookie.value, parsedCookie);
    }
  }
};

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPrivateRoute = isMatchedRoute(pathname, privateRoutes);
  const isPublicRoute = isMatchedRoute(pathname, publicRoutes);

  if (!isPrivateRoute && !isPublicRoute) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  let isAuthenticated = Boolean(accessToken);
  let setCookieHeader: string | string[] | undefined;

  const cookieHeader = req.headers.get("cookie") ?? "";

  if (!accessToken && refreshToken) {
    const sessionResponse = await checkSession(cookieHeader);
    isAuthenticated = sessionResponse.data.success;
    setCookieHeader = sessionResponse.headers["set-cookie"];
  }

  if (isPrivateRoute && !isAuthenticated) {
    const response = NextResponse.redirect(new URL("/sign-in", req.url));
    applySetCookie(response, setCookieHeader);
    return response;
  }

  if (isPublicRoute && isAuthenticated) {
    const response = NextResponse.redirect(new URL("/", req.url));
    applySetCookie(response, setCookieHeader);
    return response;
  }

  const response = NextResponse.next();
  applySetCookie(response, setCookieHeader);
  return response;
}

export const config = {
  matcher: ["/notes/:path*", "/profile/:path*", "/sign-in", "/sign-up"],
};
