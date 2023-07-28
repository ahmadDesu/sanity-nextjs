import { useEffect, useState } from "react";
import { createClient } from "next-sanity";
import Link from "next/link";
import { useRouter } from "next/router";

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
                <Link href={{
                  pathname: "/detail",
                  query: {
                    search: 'hi ganteng!!!'
                  }
                }}>
                  <a>
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
                      <p>{formatDate(pet._createdAt, "Asia/Jakarta")}</p>
                    )}
                  </a>
                </Link>
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

//function route
// function navigateToDetailPage(petId) {
//   const router = useRouter();
//   router.push(`/detail/${petId}`);
// }

// date created function
function getTimeZoneAbbreviation(timeZone) {
  const timeZoneAbbreviations = {
    "Asia/Jakarta": "WIB",
    "Asia/Makassar": "WITA",
    "Asia/Jayapura": "WIT",
    // Add other time zones and their abbreviations here if needed
  };

  return timeZoneAbbreviations[timeZone] || "";
}

function formatDate(dateString, timeZone) {
  const date = new Date(dateString);

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const formatter = new Intl.DateTimeFormat("id-ID", options);

  if (timeZone) {
    formatter.timeZone = timeZone;
  }

  const [month, day, year] = formatter
    .formatToParts(date)
    .filter(
      (part) =>
        part.type === "month" || part.type === "day" || part.type === "year"
    )
    .map((part) => part.value);

  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };
  const timeFormatter = new Intl.DateTimeFormat("id-ID", timeOptions);

  const formattedTime = timeFormatter.format(date);
  const timeZoneAbbreviation = getTimeZoneAbbreviation(timeZone);

  return `dibuat pada: ${month}/${day}/${year}, ${formattedTime} ${timeZoneAbbreviation}`;
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
