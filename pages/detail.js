import { createClient } from "next-sanity";

// Initialize the Sanity client (same as in IndexPage.js)
const client = createClient({
  projectId: "mih1agps",
  dataset: "production",
  apiVersion: "2021-10-21",
  useCdn: false,
});

export default function DetailPage({ pet }) {
  // Render the full content of the selected pet
  return (
    <div>
      <h1>{pet.name}</h1>
      {pet.content.map((block, index) => (
        <div key={index}>
          {/* Render each block of content based on its type */}
          {block._type === "block" && block.children ? (
            <div>
              {block.children.map((child, childIndex) => (
                <p key={childIndex}>{child.text}</p>
              ))}
            </div>
          ) : block._type === "image" && block.asset?._ref ? (
            <img src={getImageSrc(block.asset._ref)} alt="Content" />
          ) : null}
        </div>
      ))}
    </div>
  );
}

export async function getServerSideProps(context) {
  const { petId } = context.query;

  // Fetch the specific pet data based on the petId parameter
  const pet = await client.fetch(`*[_type == "pet" && _id == $petId][0]`, {
    petId,
  });

  return {
    props: {
      pet,
    },
  };
}

function getImageSrc(imageRef) {
  // The getImageSrc function (same as in IndexPage.js)
  // ... (include your existing implementation)
}
