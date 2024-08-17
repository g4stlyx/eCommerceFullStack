# E-Commerce Full Stack Project 
    *for documentation, goto http://localhost:8080/swagger-ui/index.html#/ after running the java spring boot application.

## Techonologies
    - [ ] React (+React Router, Bootstrap, Axios, Formik, Material UI?...) 
    - [x] Java Spring Boot(+Spring Security, Spring Data JPA...)
    - [x] MySQL, AWS
    - [/] JUnit, Jest
    - [x] Swagger
    - [ ] Typescript

## How to Run/Use the App
    *first of all, you have to have a mysql database for everything to function properly.
        then connect it via application.properties in the backend folder.(/src/main/resources)
    
    -----

    * to run the api, open backend folder as a Java Maven project:
        * OPTIONAL: if you want to run the tests first run `mvn test`
        * run `mvn spring-boot:run` in terminal or
        * simply compile and run the java app from your IDE
    
    * to run the frontend part, open frontend folder:
        * run `npm i --force || npm start` in terminal

## Models
    [x] User: id, username, password, email, phone, address, isAdmin, orders*, wishlist*, reviews*, cart*
    [x] Product: id, name, description, category_id, imgSrc, quantity, price, createdAt, updatedAt
    [x] Category: id, name, description, products, imgSrc
    [x] Review: id, star, title, text, productId, orderId, createdAt, updatedAt
    [x] Order: id, user_id, products, status, total_price, order_date
    [x] Cart: id, user_id, products
    [x] Wishlist: id, user_id, products

## Endpoints
yeah doesnt seem easy

    /
    [x] POST /signup

    /products
    [x] GET /                                               get all products
    [x] GET /$id                                            get product by id
    [x] POST /                                              create product                      #only admins
    [x] PUT /$id                                            update product by id                #only admins
    [x] DELETE /$id                                         delete product by id                #only admins
    [x] GET /search?q=&category=&price_min=&price_max=      filtering and searching products.

    [x] GET /{id}/reviews                                   Get reviews for a product.
    [x] GET /{id}/reviews/${review_id}                      Get a specific review
    [x] POST /{id}/reviews                                  Add a review for a product.
    [x] PUT /{id}/reviews/${review_id}                      Update a review.                    # admin or user himself only
    [x] DELETE /{id}/reviews/${review_id}                   Delete a review.                    # admin or user himself only

    /categories
    [x] GET /                                               get all categories
    [x] GET /$id                                            get category by id
    [x] POST /                                              create category                     #only admins
    [x] PUT /$id                                            update category by id               #only admins
    [x] DELETE /$id                                         delete category by id               #only admins

    /users
    [x] GET /                                               get all users                       
    [x] GET /$id                                            get user by id                      
    [x] POST /                                              create user                         #only admins
    [x] PUT /$id                                            update user by id                   #only admins
    [x] DELETE /$id                                         delete user by id                   #only admins
    [x] GET /{username}/orders                              Get orders for the current user.

    /orders
    [x] GET /                                               get all orders                     #only admins
    [x] GET /{id}                                           get order by id
    ![x] POST /                                             create order                       # there are things to change
    [x] POST /{id}/cancel                                   Cancel an order.

    /cart
    [x] GET /                                               Get the current user's cart
    [x] GET /{id}                                           Get items for card with ID (bunun yerine kullanıcı adı ile sepet çekilebilir, her kullanıcı 1 sepete sahip olur zaten)
    [x] DELETE /{cartItemId}                                Remove cart item with ID {cartItemId} from the current users cart
    [x] PUT /{cartItemId}/quantity                          Updates cart item, i.e. set product quantity
    [x] POST /{cartId}/order                                Create order from cart

    /wishlist
    [x] GET /                                               Get the current user's wishlist
    [x] POST /{product_id}                                  Add item to the wishlist
    [x] DELETE /{product_id}                                Remove item from the wishlist


## A modern, production-ready frontend this time.
it will be a prototype for future projects