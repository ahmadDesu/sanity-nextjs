import { useRouter } from 'next/router';

export default function AnotherPage() {
  const router = useRouter();
  const { search } = router.query;

  return (
    <div>
      <h1>Another Page</h1>
      <p>Search: {search}</p>
    </div>
  );
}
