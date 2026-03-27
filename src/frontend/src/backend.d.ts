import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MenuItem {
    id: bigint;
    name: string;
    createdAt: Time;
    description: string;
    available: boolean;
    updatedAt: Time;
    imageUrl: string;
    category: string;
    price: bigint;
}
export type Time = bigint;
export type Cuisine = {
    __kind__: "other";
    other: string;
} | {
    __kind__: "chinese";
    chinese: null;
} | {
    __kind__: "mexican";
    mexican: null;
} | {
    __kind__: "italian";
    italian: null;
} | {
    __kind__: "indian";
    indian: null;
} | {
    __kind__: "american";
    american: null;
};
export interface Message {
    id: bigint;
    content: string;
    sender: Principal;
    timestamp: Time;
    sessionId: string;
}
export interface Restaurant {
    id: bigint;
    owner: Principal;
    name: string;
    createdAt: Time;
    cuisineType: Cuisine;
    description: string;
    updatedAt: Time;
}
export interface Order {
    id: bigint;
    status: OrderStatus;
    createdAt: Time;
    restaurantId: bigint;
    updatedAt: Time;
    customerId: Principal;
    items: Array<[bigint, bigint]>;
    totalPrice: bigint;
}
export interface UserProfile {
    isRestaurantOwner: boolean;
    name: string;
}
export enum OrderStatus {
    preparing = "preparing",
    cancelled = "cancelled",
    pending = "pending",
    delivered = "delivered",
    confirmed = "confirmed",
    ready = "ready"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMenuItem(restaurantId: bigint, name: string, description: string, price: bigint, category: string, imageUrl: string): Promise<MenuItem>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createRestaurant(name: string, description: string, cuisineType: string): Promise<Restaurant>;
    deleteMenuItem(restaurantId: bigint, menuItemId: bigint): Promise<void>;
    getAllRestaurants(): Promise<Array<Restaurant>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChatMessages(sessionId: string): Promise<Array<Message>>;
    getCustomerOrders(customerId: Principal): Promise<Array<Order>>;
    getMenuItems(restaurantId: bigint): Promise<Array<MenuItem>>;
    getMenuItemsByCategory(restaurantId: bigint, category: string): Promise<Array<MenuItem>>;
    getOrder(orderId: bigint): Promise<Order>;
    getOrderStats(restaurantId: bigint): Promise<{
        totalOrders: bigint;
        totalRevenue: bigint;
    }>;
    getOrdersByRestaurant(restaurantId: bigint): Promise<Array<Order>>;
    getRestaurant(restaurantId: bigint): Promise<Restaurant>;
    getRestaurantsByCuisine(cuisineType: Cuisine): Promise<Array<Restaurant>>;
    getRestaurantsByCuisineText(cuisineType: string): Promise<Array<Restaurant>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(restaurantId: bigint, items: Array<[bigint, bigint]>): Promise<Order>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendChatMessage(sessionId: string, content: string): Promise<Message>;
    updateMenuItem(restaurantId: bigint, menuItemId: bigint, name: string, description: string, price: bigint, category: string, imageUrl: string, available: boolean): Promise<MenuItem>;
    updateOrderStatus(orderId: bigint, status: OrderStatus): Promise<Order>;
    updateRestaurant(restaurantId: bigint, name: string, description: string, cuisineType: string): Promise<Restaurant>;
}
