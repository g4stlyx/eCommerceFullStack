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
//   Card,
//   Carousel,
// } from "react-bootstrap";
// import { Product, Review } from "../types/types";
// import "../styles/productDetailed.css";

// const ProductDetailed: React.FC = () => {
//   const { productId } = useParams<{ productId: string }>();
//   const [product, setProduct] = useState<Product | null>(null);
//   const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
//   const [reviews, setReviews] = useState<Review[]>([]);

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

//   return (
//     <Container className="product-detailed my-4">
//       {/* Category */}
//       <p className="text-muted small" style={{textAlign:"left"}}>{product.category.name}</p>

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
//       <Carousel className="my-3" indicators={false} interval={null}>
//         <Carousel.Item>
//           <Row className="g-3">
//             {relatedProducts.slice(0, 3).map((relatedProduct) => (
//               <Col key={relatedProduct.id} md={4}>
//                 <Card className="text-center">
//                   <Image
//                     src={relatedProduct.imgSrc}
//                     alt={relatedProduct.name}
//                     fluid
//                     className="carousel-img"
//                   />
//                   <Card.Body>
//                     <Card.Title>{relatedProduct.name}</Card.Title>
//                     <Card.Text>${relatedProduct.price.toFixed(2)}</Card.Text>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             ))}
//           </Row>
//         </Carousel.Item>
//         <Carousel.Item>
//           <Row className="g-3">
//             {relatedProducts.slice(3, 6).map((relatedProduct) => (
//               <Col key={relatedProduct.id} md={4}>
//                 <Card className="text-center">
//                   <Image
//                     src={relatedProduct.imgSrc}
//                     alt={relatedProduct.name}
//                     fluid
//                     className="carousel-img"
//                   />
//                   <Card.Body>
//                     <Card.Title>{relatedProduct.name}</Card.Title>
//                     <Card.Text>${relatedProduct.price.toFixed(2)}</Card.Text>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             ))}
//           </Row>
//         </Carousel.Item>
//       </Carousel>

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
import { useParams } from "react-router-dom";
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
  Card,
  Carousel,
} from "react-bootstrap";
import { Product, Review } from "../types/types";
import "../styles/productDetailed.css";

const ProductDetailed: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

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
      <Container fluid className="carousel-container">
        <Carousel className="my-3" indicators={false} interval={null}>
          <Carousel.Item>
            <Row className="g-3">
              {relatedProducts.slice(0, 3).map((relatedProduct) => (
                <Col key={relatedProduct.id} md={4}>
                  <Card className="text-center">
                    <Image
                      src={relatedProduct.imgSrc}
                      alt={relatedProduct.name}
                      fluid
                      className="carousel-img"
                    />
                    <Card.Body>
                      <Card.Title>{relatedProduct.name}</Card.Title>
                      <Card.Text>
                        ${relatedProduct.price.toFixed(2)}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Carousel.Item>
          <Carousel.Item>
            <Row className="g-3">
              {relatedProducts.slice(3, 6).map((relatedProduct) => (
                <Col key={relatedProduct.id} md={4}>
                  <Card className="text-center">
                    <Image
                      src={relatedProduct.imgSrc}
                      alt={relatedProduct.name}
                      fluid
                      className="carousel-img"
                    />
                    <Card.Body>
                      <Card.Title>{relatedProduct.name}</Card.Title>
                      <Card.Text>
                        ${relatedProduct.price.toFixed(2)}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Carousel.Item>
        </Carousel>
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
