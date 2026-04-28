import { redirect } from "next/navigation";

// This demo is a landing-only door reached via SearchRight's main homepage hero
// search form (which posts to /ai-recruiter?q=...). The bare "/" route has no
// purpose, so we bounce to the real homepage where that hero search lives.
export default function Home() {
  redirect("https://www.searchright.net/");
}
