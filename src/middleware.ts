import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/", "/login", "/register"];

export default withAuth(
  function middleware(request) {
    const pathname = request.nextUrl.pathname;

    if (PUBLIC_ROUTES.includes(pathname) && request.nextauth.token !== null) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
    
  },
  {
    callbacks: {
      authorized: ({ req: request, token }) => {
        const pathname = request.nextUrl.pathname;

        if (PUBLIC_ROUTES.includes(pathname)) {
          return true;
        }

        return token !== null;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
