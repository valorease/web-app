import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();

  return <p>{router.query["public-id"]}</p>;
}
