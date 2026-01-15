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

    console.log('Middleware: Path', pathname, 'User found:', !!user ? 'YES' : 'NO', 'Error:', userError?.message || 'None');

    const isProtectedRoute = pathname.startsWith('/dashboard') ||
        pathname.startsWith('/brands') ||
        pathname.startsWith('/users') ||
        pathname.startsWith('/settings') ||
        pathname.startsWith('/analytics') ||
        pathname.startsWith('/notifications');

    // 1. Handle Invalid/Stale Sessions Logic
    if (userError || !user) {
        // If we are on a protected route and have an error/no user, force clean slate
        if (isProtectedRoute) {
            console.log('Middleware: Protected route access denied. Redirecting to login.');
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            // Clear cookies to prevent loops if session is corrupted
            supabaseResponse.cookies.getAll().forEach(cookie => {
                supabaseResponse.cookies.delete(cookie.name)
            });
            return NextResponse.redirect(url)
        }
    }

    // 2. Handle Login/Root Redirects for Authenticated Users
    if (user && (pathname === '/login' || pathname === '/')) {
        console.log('Middleware: Redirecting authenticated user to /dashboard');
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
