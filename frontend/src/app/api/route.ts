
const delay = ms => new Promise(res => setTimeout(res, ms));

const getTheGuy = async () => {
    await delay(5000);
    //const data = await fetch('https://swapi.dev/api/people/1', { cache: 'no-store' });
    //const theGuy = await data.json();
    return 'Hello World';
  }

export async function GET() {
    console.log('cokolwiek')
    return new Response(await getTheGuy());
}
