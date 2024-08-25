import React, { useEffect, useState } from 'react';
import { getWishlistApi, removeItemFromWishlistApi } from '../api/WishlistApiService';
import { addItemToCartApi } from '../api/CartApiService';
import { WishlistItem } from '../../types/types';

const Wishlist: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await getWishlistApi();
      setWishlistItems(response.data.wishlistItems);
    } catch (error) {
      setError('Failed to fetch wishlist: '+ error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: number) => {
    try {
      await addItemToCartApi(productId);
      alert('Product added to cart');
    } catch (error) {
      setError('Failed to add product to cart: '+ error);
    }
  };

  const handleRemoveFromWishlist = async (wishlistItemId: number) => {
    try {
      await removeItemFromWishlistApi(wishlistItemId);
      setWishlistItems(wishlistItems.filter(item => item.id !== wishlistItemId));
    } catch (error) {
      setError('Failed to remove item from wishlist: '+ error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Favorilerim</h1>
      {!wishlistItems || wishlistItems.length === 0 ? (
        <p>Favorilerinde ürün yok, <a href='/'>aramaya devam et.</a></p>
      ) : (
        <ul>
          {wishlistItems.map((item) => (
            <li key={item.id}>
              <div>
                <h3>{item.product.name}</h3>
                <p>{item.product.description}</p>
                <p>Price: ${item.product.price}</p>
                <button onClick={() => handleAddToCart(item.product.id)}>Add to Cart</button>
                <button onClick={() => handleRemoveFromWishlist(item.id)}>Remove from Wishlist</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Wishlist;
