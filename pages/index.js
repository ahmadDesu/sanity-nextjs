import { createClient } from "next-sanity";
export default function IndexPage({ pets }) {
  return (
    <>
      <header>
        <h1>Sanity + Next.js</h1>
      </header>
      <main>
        <h2>Pets</h2>
        {pets.length > 0 ? (
          <ul>
            {pets.map((pet) => (
              <li key={pet._id}>
                <h3>{pet.name}</h3>
                {pet.content.length > 0 && pet.content[0]._type === "span" && (
                  <p>{pet.content[0].text}</p>
                )}
                {pet.content.length > 0 && pet.content[0]._type === "image" && (
                  <img src={pet.content[0].asset._ref} alt={pet.name} />
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No pets to show</p>
        )}
      </main>
    </>
  );
}

const client = createClient({
  projectId: "mih1agps",
  dataset: "production",
  apiVersion: "2021-10-21",
  useCdn: false
});

export async function getStaticProps() {
  const pets = await client.fetch(`*[_type == "pet"]`);

  return {
    props: {
      pets
    },
    revalidate: 10,
  };
}
