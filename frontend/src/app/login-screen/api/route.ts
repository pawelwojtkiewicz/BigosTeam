'server action'
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    const body = await request.json();
    const res = await fetch('http://161.35.21.67:1337/api/auth/local', {
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(body, null, 2),
    });

    const data = await res.json();
    const cookieStore = cookies()
    cookieStore.set('jwt', data.jwt);



    //const data2 = await res2.json();
    return NextResponse.json(data);
}
