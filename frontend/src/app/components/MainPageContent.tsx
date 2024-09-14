export const dynamic = 'force-dynamic'

export default async function MainPageContent() {
    const data = await fetch('http://localhost:3000/api', { cache: 'no-store' });
    const theGuy = await data.json();

    return (
        <div>MASZ NA IMIĘ: {theGuy.name}</div>
    );
}
