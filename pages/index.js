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
                {renderPetContent(pet.content)}
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

function getImageSrc(imageRef) {
  const imageName = imageRef.replace("image-", "").replace("-jpg", ".jpg");
  return `https://cdn.sanity.io/images/mih1agps/production/${imageName}`;
}

function renderPetContent(content) {
  if (!content || content.length === 0) {
    return null;
  }

  for (const block of content) {
    if (block._type === "span" && block.text) {
      return <p>{block.text}</p>;
    } else if (block._type === "image" && block.asset && block.asset._ref) {
      const imageSrc = getImageSrc(block.asset._ref);
      return <img src={imageSrc} alt="Pet Image" />;
    }
  }

  return null;
}

const client = createClient({
  projectId: "mih1agps",
  dataset: "production",
  apiVersion: "2021-10-21",
  useCdn: false,
});

export async function getStaticProps() {
  const pets = await client.fetch(`*[_type == "pet"]`);

  return {
    props: {
      pets,
    },
    revalidate: 10,
  };
}
