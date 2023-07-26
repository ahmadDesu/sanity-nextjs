import { createClient } from "next-sanity";
function getImageSrc(imageRef) {
  const imageName = imageRef.replace("image-", "").replace("-jpg", ".jpg");
  return `https://cdn.sanity.io/images/mih1agps/production/${imageName}`;
}

function renderPetContent(content) {
  if (!content || content.length === 0) {
    return null;
  }

  let firstImageSrc = "";
  let firstText = "";

  for (const block of content) {
    if (block._type === "image" && block.asset?._ref && !firstImageSrc) {
      firstImageSrc = getImageSrc(block.asset._ref);
    } else if (block._type === "block" && block.children) {
      for (const child of block.children) {
        if (child._type === "span" && child.text && !firstText) {
          firstText = child.text;
          break;
        }
      }
    }

    if (firstImageSrc && firstText) {
      break;
    }
  }

  if (firstImageSrc) {
    return (
      <>
        {firstImageSrc && <img src={firstImageSrc} alt="Pet Image" />}
        {firstText && <p>{firstText}</p>}
      </>
    );
  } else {
    return null;
  }
}

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
                {renderPetContent(pet.content)}
                <h3>{pet.name}</h3>
                <p>{pet?.content?.text?.[0]}</p>
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
