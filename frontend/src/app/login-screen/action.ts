 'use server'
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation'

export const sendData = async (values) => {
    console.log('values:', values)
    const res = await fetch('http://161.35.21.67:1337/api/auth/local', {
        headers: {
          'content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(values, null, 2)
      });
      const data = await res.json();
      cookies().set('jwt', data.jwt);
      redirect(`../`);
}

export const sendData2 = async (values) => {
  console.log('values:', values)
  const a = {
    data: values
  }
  console.log(a)
  console.log(`Bearer ${cookies().get('jwt').value}`)
  const res = await fetch('http://161.35.21.67:1337/api/events', {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${cookies().get('jwt').value}`,
  },
      method: 'POST',
      body: JSON.stringify(a)
    });
   const data = await res.json();
   console.log(data)
   return data;
   // cookies().set('jwt', data.jwt);
   // redirect(`../mappage`);
}