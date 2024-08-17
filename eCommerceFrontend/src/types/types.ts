import { ReactNode } from 'react';

export interface DecodedToken {
    exp: number;
    sub: string;
    isAdmin: boolean;
}

export interface AuthenticationRouteProps {
    children: ReactNode;
}

export interface AuthContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    username: string | null;
    setUsername: React.Dispatch<React.SetStateAction<string | null>>;
    token: string | null;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
    storedToken: string | null;
    isAdmin: boolean;
    setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ErrorProps{
    message: string;
    status: number;
}

export interface SignUpFormValues{
    username: string;
    password:string;
}

export interface User{
    id: number;
    username: string;
    password: string;
    isAdmin: boolean;
    email:string | null;
    phoneNumber: string | null;
    address: string | null;
    orders: Order[];
    reviews: Review[];
    cart: Cart;
    wishlist: Wishlist;
}

export interface Product{
    id: number;
    name: string;
    description: string;
    quantity: number;
    price: number;
    createdAt: Date;
    updatedAt: Date;
    imgSrc: string | null;
    category: Category;
}

export interface Category{
    id: number;
    name: string;
    description: string;
    imgSrc: string | null;
    products: Product[];
}

export interface Review{
    id:number;
    user: User;
    product: Product;
    rating: number;
    title: string;
    text: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Order{
    id:number;
    user: User;
    orderItems: OrderItem[];
    status:string;
    totalPrice: number;
    orderDate: Date;
}

export interface OrderItem{
    id:number;
    order: Order;
    product: Product;
    quantity:number;
}

export interface Cart{
    id:number;
    user:User;
    cartItems: CartItem[];
}

export interface CartItem{
    id:number;
    cart: Cart;
    product: Product;
    quantity:number;
}

export interface Wishlist{
    id:number;
    user:User;
    wishlistItems: WishlistItem[];
}

export interface WishlistItem{
    id:number;
    wishlist: Wishlist;
    product: Product;
}
