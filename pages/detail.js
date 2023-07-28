import { useRouter } from "next/router";

export default function DetailPage() {
  const router = useRouter();
  const { id } = router.query;

  // Here you can fetch the specific pet data using the `id` parameter and render the detailed content.

  return (
    <div>
      <h1>Detail Page</h1>
      <p>Pet ID: {id}</p>
      {/* Render the detailed content here */}
    </div>
  );
}
