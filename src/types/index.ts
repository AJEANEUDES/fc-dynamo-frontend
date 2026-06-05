export interface User {
  id: string;
  name: string;
  email: string;
  role: 'visiteur' | 'membre' | 'staff' | 'journaliste' | 'admin';
  created_at: string;
}

export interface Player {
  id: string;
  first_name: string;
  last_name: string;
  position: string;
  jersey_number: number;
  nationality: string;
  birth_date: string;
  photo?: string;
  bio?: string;
}

export interface FootballMatch {
  id: string;
  opponent: string;
  match_date: string;
  stadium: string;
  score_home: number | null;
  score_away: number | null;
  status: 'upcoming' | 'live' | 'finished';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Article {
  id: string;
  user_id: string;
  category_id: string;
  title: string;
  slug: string;
  content: string;
  image?: string;
  published_at: string;
  user?: Pick<User, 'id' | 'name'>;
  category?: Pick<Category, 'id' | 'name' | 'slug'>;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
}

export interface Order {
  id: string;
  user_id: string;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  product?: Product;
}

export interface Ticket {
  id: string;
  user_id: string;
  match_id: string;
  quantity: number;
  total_price: number;
  created_at: string;
  match?: FootballMatch;
}

export interface AuthResponse {
  user: User;
  token: string;
}
