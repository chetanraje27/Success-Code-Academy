import HomeClient from "./home/HomeClient";
import { getApiBase } from "@/lib/api";

export default async function Home() {
  let courses = [];
  try {
    const res = await fetch(`${getApiBase()}/api/v1/content/courses`, { cache: 'no-store' });
    const data = await res.json();
    if (data.status === 'success') {
      courses = data.data || [];
    }
  } catch (err) {
    console.error("Failed to fetch courses for home page", err);
  }

  return <HomeClient courses={courses} />;
}