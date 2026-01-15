import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    let supabaseResponse = NextResponse.next({
        request,
    })


    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Do not run code between createServerClient and getUser. A simple mistake could make it very hard to debug issues with deep-linked URLs.

    const {
        data: { user },
        error: userError
    } = await supabase.auth.getUser()

    console.log('Middleware: Path', pathname, 'User found:', !!user, 'Error:', userError?.message);

    const isPublicRoute = pathname === '/login' || pathname === '/unauthorized' || pathname.startsWith('/auth/callback');

    const isProtectedRoute = pathname.startsWith('/dashboard') ||
        pathname.startsWith('/brands') ||
        pathname.startsWith('/users') ||
        pathname.startsWith('/settings') ||
        pathname.startsWith('/analytics') ||
        pathname.startsWith('/notifications');

    if (!user && isProtectedRoute) {
        console.log('Middleware: Redirecting to /login (Protected route, no user)');
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    if (user && (pathname === '/login' || pathname === '/')) {
        console.log('Middleware: Redirecting to /dashboard (At login/root, user exists)');
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
    }


    // IMPORTANT: You *must* return the supabaseResponse object as is. If you're creating a new response object with NextResponse.next() make sure to:
    // 1. Pass the request in it, like so:
    //    const myNewResponse = NextResponse.next({ request })
    // 2. Copy over the cookies, like so:
    //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
    // 3. Change the myNewResponse object to fit your needs, but avoid changing the cookies!
    // 4. Finally: return myNewResponse
    // If this is not done, you may be causing the browser and server to go out of sync and terminate the user's session prematurely!

    return supabaseResponse
}
