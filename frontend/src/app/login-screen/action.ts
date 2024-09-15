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

export const sendInformationAboutNewDangerousEvent = async (values) => {
  const { type, ...rest } = values
  const preparedData = {
    data: {
      type: { connect: [type] },
      ...rest,
    }
  };
  const res = await fetch('http://161.35.21.67:1337/api/events', {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${cookies().get('jwt').value}`,
    },
      method: 'POST',
      body: JSON.stringify(preparedData)
    });
    const data = await res.json();
    return data;
}

export const getInformationAboutNewDangerousEvent = async ([lat, long]) => {
  const res = await fetch(`http://161.35.21.67:1337/api/events?lat=${lat}&long=${long}`, {
    headers: {
        'content-type': 'application/json'
      },
      method: 'GET',
    });
    const data = await res.json();
    return data;
}

export const getItemsForEventTypesSelect = async () => {
  const res = await fetch(`http://161.35.21.67:1337/api/event-types`, {
    headers: {
        'content-type': 'application/json'
      },
      method: 'GET',
    });
    const data = await res.json();
    return data;
}