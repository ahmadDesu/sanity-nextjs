// pages/detail/[id].js
import { createClient } from "next-sanity";

export default function DetailPage({ pet }) {
  return (
    <div>
      <h1>{pet.name}</h1>
      {/* Render the rest of the pet's content here */}
    </div>
  );
}

const client = createClient({
  projectId: "mih1agps",
  dataset: "production",
  apiVersion: "2021-10-21",
  useCdn: false,
});

export async function getServerSideProps(context) {
  const { id } = context.query;

  // Fetch the pet data based on the ID from Sanity
  const pet = await client.fetch(`*[_type == "pet" && _id == $id][0]`, { id });

  return {
    props: {
      pet,
    },
  };
}
