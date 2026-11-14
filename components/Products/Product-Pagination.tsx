
import { CategoryValue } from "@/lib/utils";
import { getProductPage } from "@/lib/products";
import ProductList from "./Product-List";

type ProductPaginationProps = {
  category?: CategoryValue | null;
  type?: string | null;
  search: string | null;
};

async function ProductPagination({ category, type, search}: ProductPaginationProps) {
  const page = await getProductPage(category, type, null, 8, search);

  return (
    <div>
      <ProductList
        key={`${category ?? "ALL"}-${type ?? "ALL"}-${search ?? "ALL"}`}
        initialItem={page.items}
        category={category}
        type={type}
        initialNextCursor={page.nextCursor}
        initialHasMore={page.hasMore}
        search={search}
      />
    </div>
  );
}

export default ProductPagination;
