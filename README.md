# E-Commerce Full Stack Project 
    *for documentation, goto http://localhost:8080/swagger-ui/index.html#/ after running the java spring boot application.

## Techonologies
    - [ ] React (+React Router, Bootstrap, Axios, Formik, Material UI?...) 
    - [ ] Java Spring Boot(+Spring Security, Spring Data JPA...)
    - [ ] MySQL, AWS
    - [ ] JUnit, Jest
    - [ ] Swagger
    - [ ] Typescript?

## How to Run/Use the App
    *first of all, you have to have a mysql database for everything to function properly.
        then connect it via application.properties in the backend folder.(/src/main/resources)
    
    -----

    * to run the api, open backend folder as a Java Maven project:
        * run `mvn spring-boot:run` in terminal or
        * simply compile and run the java app from your IDE
    
    * to run the frontend part, open frontend folder:
        * run `npm i --force || npm start` in terminal

## Endpoints
yeah doesnt seem easy

    /
    [ ] POST /login                                         login                               #only if no tokens
    [ ] POST /signup                                        signup                              #only if no tokens
    [ ] POST /logout                                        logout                              #only if logged in

    /products
    [ ] GET /                                               get all products
    [ ] GET /$id                                            get product by id
    [ ] POST /                                              create product                      #only admins
    [ ] PUT /$id                                            update product by id                #only admins
    [ ] DELETE /$id                                         delete product by id                #only admins
    [?] GET /search?q=                                      Search products by query.
    [?] GET /filter?category=&price_min=&price_max=         Filter products.
    [ ] GET /{id}/reviews                                   Get reviews for a product.
    [ ] GET /{id}/reviews/${review_id}                      Get a specific review
    [ ] POST /{id}/reviews                                  Add a review for a product.
    [ ] PUT /{id}/reviews/${review_id}                      Update a review.
    [ ] DELETE /{id}/reviews/${review_id}                   Delete a review.

    /categories
    [ ] GET /                                               get all categories
    [ ] GET /$id                                            get category by id
    [ ] POST /                                              create category                     #only admins
    [ ] PUT /$id                                            update category by id               #only admins
    [ ] DELETE /$id                                         delete category by id               #only admins

    /users
    [ ] GET /                                               get all users                       #only admins
    [ ] GET /$id                                            get user by id                      only show the current user
    [ ] POST /                                              create user                         #only admins
    [ ] PUT /$id                                            update user by id                   #only admins
    [ ] DELETE /$id                                         delete user by id                   #only admins
    [ ] GET /orders                                         Get orders for the current user.
    [?] POST /{id}/cancel                                   Cancel an order.
    [?] POST /forgot-password
    [?] POST /reset-password

    /orders
    [ ] GET /                                               get all orders                      #only admins
    [ ] GET /{id}                                           get order by id
    [ ] POST /                                              create order
    [ ] POST /{id}                                          update order by id 

    /cart
    [ ] POST /                                              Create cart
    [ ] GET /{id}                                           Get items for card with ID
    [ ] POST /{id}                                          Add CartItem to cart with ID
    [ ] DELETE /{id}/{product_id}                           Remove product with ID {product_id} from cart with ID {id}
    [ ] PUT /{id}/quantity                                  Updates cart item, i.e. set product quantity
    [ ] POST /{id}/order                                    Create order from cart

    /wishlist
    [ ] GET /
    [ ] POST /
    [ ] DELETE /{product_id}


## A modern, production-ready frontend this time.
it will be a prototype for future projects