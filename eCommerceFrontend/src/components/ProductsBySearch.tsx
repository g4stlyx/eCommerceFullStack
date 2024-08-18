//! "/search?q=&" : to show products for a specific search.
//? trendyol uses this: https://www.trendyol.com/sr?q=gaming%20kulakl%C4%B1k&qt=gaming%20kulakl%C4%B1k&st=gaming%20kulakl%C4%B1k&os=1 ,
//? qt= query text, st= search term, os= order selection, would i have any use of these?

import React from 'react'
import { useSearchParams } from 'react-router-dom';

const ProductsBySearch: React.FC = () => {

  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <div>
      <h1>Search Results</h1>
      <p>Showing results for: {query}</p>
      {/* Display products based on search query */}
    </div>
  )
}

export default ProductsBySearch
