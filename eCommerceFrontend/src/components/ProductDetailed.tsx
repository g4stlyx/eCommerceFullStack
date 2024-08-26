// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import {
//   getProductByIdApi,
//   searchAndFilterProductsApi,
// } from "./api/ProductApiService";
// import { addItemToCartApi } from "./api/CartApiService";
// import { addItemToWishlistApi } from "./api/WishlistApiService";
// import { getReviewsByProductIdApi } from "./api/ReviewApiService";
// import {
//   Container,
//   Row,
//   Col,
//   Image,
//   Button,
//   Card
// } from "react-bootstrap";
// import { Product, Review } from "../types/types";
// import "../styles/productDetailed.css";

// const ProductDetailed: React.FC = () => {
//   const { productId } = useParams<{ productId: string }>();
//   const [product, setProduct] = useState<Product | null>(null);
//   const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
//   const [reviews, setReviews] = useState<Review[]>([]);
//   const [carouselIndex, setCarouselIndex] = useState(0);

//   useEffect(() => {
//     getProductByIdApi(Number(productId))
//       .then((response) => setProduct(response.data))
//       .catch((error) => console.error(error));

//     if (product?.category) {
//       searchAndFilterProductsApi({ category: product.category.name })
//         .then((response) => setRelatedProducts(response.data))
//         .catch((error) => console.error(error));
//     }

//     getReviewsByProductIdApi(Number(productId))
//       .then((response) => setReviews(response.data))
//       .catch((error) => console.log(error));
//   }, [productId, product?.category]);

//   if (!product) return <div>Loading...</div>;

//   const handlePrev = () => {
//     setCarouselIndex((prevIndex) =>
//       prevIndex === 0 ? relatedProducts.length - 1 : prevIndex - 1
//     );
//   };

//   const handleNext = () => {
//     setCarouselIndex((prevIndex) =>
//       prevIndex === relatedProducts.length - 1 ? 0 : prevIndex + 1
//     );
//   };

//   return (
//     <Container className="product-detailed my-4">
//       {/* Category */}
//       <p className="text-muted small" style={{ textAlign: "left" }}>
//         {product.category.name}
//       </p>

//       <Row className="align-items-center">
//         <Col md={6}>
//           {/* Product Image */}
//           <Image
//             src={product.imgSrc}
//             alt={product.name}
//             fluid
//             className="product-image"
//           />
//         </Col>
//         <Col md={6}>
//           {/* Product Info */}
//           <h1>{product.name}</h1>
//           <p>{product.description}</p>
//           <p>Quantity: {product.quantity}</p>
//           <p className="text-primary h4">${product.price.toFixed(2)}</p>
//           {/* Centered Buttons */}
//           <div className="d-flex justify-content-center gap-2 mt-3">
//             <Button
//               variant="primary"
//               onClick={() => addItemToCartApi(product.id)}
//             >
//               Sepete ekle
//             </Button>
//             <Button
//               variant="outline-primary"
//               onClick={() => addItemToWishlistApi(product.id)}
//             >
//               Favorilere ekle
//             </Button>
//           </div>
//         </Col>
//       </Row>

//       {/* Similar Products */}
//       <h2 className="mt-5">Benzer Ürünler</h2>
//       <Container fluid className="carousel-container position-relative">
//         <Row className="g-3">
//           {relatedProducts.slice(carouselIndex, carouselIndex + 4).map((relatedProduct) => (
//             <Col key={relatedProduct.id} xs={12} sm={6} md={4} lg={3}>
//               <Card className="text-center">
//                 <Image
//                   src={relatedProduct.imgSrc}
//                   alt={relatedProduct.name}
//                   fluid
//                   className="carousel-img"
//                 />
//                 <Card.Body>
//                   <Card.Title>{relatedProduct.name}</Card.Title>
//                   <Card.Text>${relatedProduct.price.toFixed(2)}</Card.Text>
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))}
//         </Row>

//         {/* Custom left and right buttons */}
//         <Button
//           className="carousel-control-prev"
//           onClick={handlePrev}
//         >
//           &lsaquo;
//         </Button>
//         <Button
//           className="carousel-control-next"
//           onClick={handleNext}
//         >
//           &rsaquo;
//         </Button>
//       </Container>

//       {/* Reviews */}
//       <h2 className="mt-5">Değerlendirmeler</h2>
//       {reviews.length ? (
//         reviews.map((review) => (
//           <Card key={review.id} className="my-3">
//             <Card.Body>
//               <Card.Title>
//                 {review.title} - {review.rating}/5
//               </Card.Title>
//               <Card.Subtitle className="mb-2 text-muted">
//                 By {review.user.username} on{" "}
//                 {new Date(review.createdAt).toLocaleDateString()}
//               </Card.Subtitle>
//               <Card.Text>{review.text}</Card.Text>
//             </Card.Body>
//           </Card>
//         ))
//       ) : (
//         <p>Henüz bir değerlendirme yapılmadı.</p>
//       )}
//     </Container>
//   );
// };

// export default ProductDetailed;

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getProductByIdApi,
  searchAndFilterProductsApi,
} from "./api/ProductApiService";
import { addItemToCartApi } from "./api/CartApiService";
import { addItemToWishlistApi } from "./api/WishlistApiService";
import { getReviewsByProductIdApi } from "./api/ReviewApiService";
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  Card
} from "react-bootstrap";
import { Product, Review } from "../types/types";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import "../styles/productDetailed.css";

const ProductDetailed: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    getProductByIdApi(Number(productId))
      .then((response) => setProduct(response.data))
      .catch((error) => console.error(error));

    if (product?.category) {
      searchAndFilterProductsApi({ category: product.category.name })
        .then((response) => setRelatedProducts(response.data))
        .catch((error) => console.error(error));
    }

    getReviewsByProductIdApi(Number(productId))
      .then((response) => setReviews(response.data))
      .catch((error) => console.log(error));
  }, [productId, product?.category]);

  if (!product) return <div>Loading...</div>;

  const handlePrev = () => {
    setCarouselIndex((prevIndex) =>
      prevIndex === 0 ? relatedProducts.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCarouselIndex((prevIndex) =>
      prevIndex === relatedProducts.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <Container className="product-detailed my-4">
      {/* Category */}
      <p className="text-muted small" style={{ textAlign: "left" }}>
        {product.category.name}
      </p>

      <Row className="align-items-center">
        <Col md={6}>
          {/* Product Image */}
          <Image
            src={product.imgSrc}
            alt={product.name}
            fluid
            className="product-image"
          />
        </Col>
        <Col md={6}>
          {/* Product Info */}
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <p>Quantity: {product.quantity}</p>
          <p className="text-primary h4">${product.price.toFixed(2)}</p>
          {/* Centered Buttons */}
          <div className="d-flex justify-content-center gap-2 mt-3">
            <Button
              variant="primary"
              onClick={() => addItemToCartApi(product.id)}
            >
              Sepete ekle
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => addItemToWishlistApi(product.id)}
            >
              Favorilere ekle
            </Button>
          </div>
        </Col>
      </Row>

      {/* Similar Products */}
      <h2 className="mt-5">Benzer Ürünler</h2>
      <Container fluid className="carousel-container position-relative">
        <Row className="g-3">
          {relatedProducts.slice(carouselIndex, carouselIndex + 4).map((relatedProduct) => (
            <Col key={relatedProduct.id} xs={12} sm={6} md={4} lg={3}>
              <Card className="text-center">
                {/* Link to product detail page */}
                <Link to={`/products/${relatedProduct.id}`}>
                  <Image
                    src={relatedProduct.imgSrc}
                    alt={relatedProduct.name}
                    fluid
                    className="carousel-img"
                  />
                </Link>
                <Card.Body>
                  <Card.Title>{relatedProduct.name}</Card.Title>
                  <Card.Text>${relatedProduct.price.toFixed(2)}</Card.Text>
                  <div className="d-flex justify-content-center gap-2">
                    {/* Add to Cart Button with Icon */}
                    <Button
                      variant="primary"
                      onClick={() => addItemToCartApi(relatedProduct.id)}
                    >
                      <FaShoppingCart /> Sepete Ekle
                    </Button>
                    {/* Add to Wishlist Button with Icon */}
                    <Button
                      variant="outline-primary"
                      onClick={() => addItemToWishlistApi(relatedProduct.id)}
                    >
                      <FaHeart />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Custom left and right buttons */}
        <Button
          className="carousel-control-prev"
          onClick={handlePrev}
        >
          &lsaquo;
        </Button>
        <Button
          className="carousel-control-next"
          onClick={handleNext}
        >
          &rsaquo;
        </Button>
      </Container>

      {/* Reviews */}
      <h2 className="mt-5">Değerlendirmeler</h2>
      {reviews.length ? (
        reviews.map((review) => (
          <Card key={review.id} className="my-3">
            <Card.Body>
              <Card.Title>
                {review.title} - {review.rating}/5
              </Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                By {review.user.username} on{" "}
                {new Date(review.createdAt).toLocaleDateString()}
              </Card.Subtitle>
              <Card.Text>{review.text}</Card.Text>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>Henüz bir değerlendirme yapılmadı.</p>
      )}
    </Container>
  );
};

export default ProductDetailed;
