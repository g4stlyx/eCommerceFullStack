import React, { useEffect, useState } from "react";
import { searchAndFilterProductsApi } from "./api/ProductApiService";
import { Product } from "../types/types";

const ProductsBySearch: React.FC = () => {

  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [priceMin, setPriceMin] = useState<number | undefined>(undefined);
  const [priceMax, setPriceMax] = useState<number | undefined>(undefined);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await searchAndFilterProductsApi({
          q: query,
          category,
          price_min: priceMin,
          price_max: priceMax,
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [query, category, priceMin, priceMax]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value);
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => setCategory(e.target.value);
  const handlePriceMinChange = (e: React.ChangeEvent<HTMLInputElement>) => setPriceMin(parseFloat(e.target.value) || undefined);
  const handlePriceMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => setPriceMax(parseFloat(e.target.value) || undefined);


  return (
    <div>
      <input type="text" value={query} onChange={handleQueryChange} placeholder="Search..." />
      <input type="text" value={category} onChange={handleCategoryChange} placeholder="Category..." />
      <input type="number" value={priceMin || ''} onChange={handlePriceMinChange} placeholder="Min Price..." />
      <input type="number" value={priceMax || ''} onChange={handlePriceMaxChange} placeholder="Max Price..." />

      <ul>
        {products.map(product => (
          <li key={product.id}>{product.name} - ${product.price}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsBySearch;
