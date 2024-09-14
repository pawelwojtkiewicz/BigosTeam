export const dynamic = 'force-dynamic'





export default async function MainPageContent() {

    const data = await fetch('http://localhost:3000/api', { cache: 'no-store' });
    console.log('data: ', data.body)
    const theGuy = await data.json();
    console.log('theGuy: ', theGuy);

    return (
       
            <div>MASZ NA IMIĘ: {theGuy.name}</div>
       
    );
}