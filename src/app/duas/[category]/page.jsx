"use client";

import { useParams, useSearchParams } from "next/navigation";
import Main from "@/components/Main";

export default function DuaPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const categorySlug = params.category;
  const cat = searchParams.get("cat");
  const subcat = searchParams.get("subcat");
  const dua = searchParams.get("dua");

  return (
    <Main
      categorySlug={categorySlug}
      categoryId={cat}
      subcategoryId={subcat}
      duaId={dua}
    />
  );
}
