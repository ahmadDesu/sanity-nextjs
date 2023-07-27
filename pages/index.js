import { createClient } from "next-sanity";

export default function IndexPage({ pets }) {
  pets.sort((a, b) => new Date(b._createdAt) - new Date(a._createdAt));
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
                {getFirstImage(pet.content) && (
                  <img
                    src={getFirstImage(pet.content)}
                    id="thumbnail-post"
                    alt="thumbnail"
                  />
                )}
                <h3>{pet.name}</h3>
                {getFirstText(pet.content) && (
                  <p>{getFirstText(pet.content)}</p>
                )}
                {pet._createdAt && (
                  <p>Created at: {formatDate(pet._createdAt, "WIB")}</p>
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

function getImageSrc(imageRef) {
  const imageName = imageRef.replace("image-", "").replace("-jpg", ".jpg");
  return `https://cdn.sanity.io/images/mih1agps/production/${imageName}`;
}

function getFirstImage(content) {
  if (!content || content.length === 0) {
    return null;
  }

  for (const block of content) {
    if (block._type === "image" && block.asset?._ref) {
      return getImageSrc(block.asset._ref);
    }
  }

  return null;
}

function getFirstText(content) {
  if (!content || content.length === 0) {
    return null;
  }

  for (const block of content) {
    if (block._type === "block" && block.children) {
      for (const child of block.children) {
        if (child._type === "span" && child.text) {
          return child.text;
        }
      }
    }
  }

  return null;
}

// date created function
const timeZones = {
  WIB: "Asia/Jakarta",
  WITA: "Asia/Makassar",
  WIT: "Asia/Jayapura",
};

function formatDate(dateString, timeZone) {
  const date = new Date(dateString);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const formattedDate = date.toLocaleDateString("en-US", options);

  if (timeZone && timeZones[timeZone]) {
    const timeZoneAbbr = timeZone.toUpperCase();
    const timeZoneName = Intl.DateTimeFormat("en-US", {
      timeZone: timeZones[timeZone],
      timeZoneName: "short",
    }).format(date);

    return `${formattedDate}, ${timeZoneName.replace(timeZoneAbbr, timeZone)}`;
  }

  return formattedDate;
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
