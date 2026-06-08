export interface User {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'visiteur' | 'membre' | 'staff' | 'journaliste' | 'admin';
  birth_date: string;
  created_at: string;
}

export interface Team {
  id: string;
  name_ru: string;
  name_en?: string;
  slug: string;
  sport: string;
  gender: string;
  description_ru?: string;
  description_en?: string;
  logo?: string;
}

export interface Player {
  id: string;
  team_id: string;
  first_name: string;
  last_name: string;
  position: string;
  position_group: string;
  jersey_number: number;
  nationality: string;
  birth_date: string;
  photo?: string;
  bio_ru?: string;
  bio_en?: string;
  stats?: Record<string, number>;
  is_on_loan: boolean;
  team?: Team;
}

export interface StaffMember {
  id: string;
  team_id: string;
  first_name: string;
  last_name: string;
  role_ru: string;
  role_en?: string;
  photo?: string;
  bio_ru?: string;
  bio_en?: string;
  nationality: string;
  team?: Team;
}

export interface Competition {
  id: string;
  name_ru: string;
  name_en?: string;
  slug: string;
  type: string;
  season: string;
  logo?: string;
}

export interface FootballMatch {
  id: string;
  competition_id: string;
  opponent: string;
  opponent_logo?: string;
  home_away: 'home' | 'away';
  match_date: string;
  stadium: string;
  score_home: number | null;
  score_away: number | null;
  status: 'upcoming' | 'live' | 'finished';
  competition?: Competition;
}

export interface Standing {
  id: string;
  competition_id: string;
  position: number;
  club_name_ru: string;
  club_name_en?: string;
  club_logo?: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  points: number;
}

export interface Trophy {
  id: string;
  title_ru: string;
  title_en?: string;
  season: string;
  image?: string;
  description_ru?: string;
  description_en?: string;
}

export interface Category {
  id: string;
  name_ru: string;
  name_en?: string;
  slug: string;
}

export interface Article {
  id: string;
  user_id: string;
  category_id: string;
  title_ru: string;
  title_en?: string;
  slug: string;
  excerpt_ru?: string;
  excerpt_en?: string;
  content_ru: string;
  content_en?: string;
  image?: string;
  tags?: string[];
  is_featured: boolean;
  type: string;
  published_at: string;
  user?: Pick<User, 'id' | 'name'>;
  category?: Pick<Category, 'id' | 'name_ru' | 'name_en' | 'slug'>;
}

export interface Video {
  id: string;
  match_id?: string;
  type: string;
  title_ru: string;
  title_en?: string;
  slug: string;
  description_ru?: string;
  description_en?: string;
  thumbnail?: string;
  video_url: string;
  duration?: number;
  published_at: string;
  match?: FootballMatch;
}

export interface GalleryPhoto {
  id: string;
  gallery_id: string;
  image: string;
  caption_ru?: string;
  caption_en?: string;
  order: number;
}

export interface Gallery {
  id: string;
  match_id?: string;
  title_ru: string;
  title_en?: string;
  slug: string;
  cover_image?: string;
  published_at: string;
  match?: FootballMatch;
  photos?: GalleryPhoto[];
}

export interface Product {
  id: string;
  name_ru: string;
  name_en?: string;
  description_ru?: string;
  description_en?: string;
  price: number;
  stock: number;
  image?: string;
  is_customizable: boolean;
  category_store: string;
  images?: string[];
}

export interface Tour {
  id: string;
  name_ru: string;
  name_en?: string;
  description_ru?: string;
  description_en?: string;
  price_adult: number;
  price_child: number;
  image?: string;
  is_active: boolean;
  slots?: TourSlot[];
}

export interface TourSlot {
  id: string;
  tour_id: string;
  date: string;
  start_time: string;
  capacity: number;
  booked_count: number;
  tour?: Tour;
}

export interface TourBooking {
  id: string;
  user_id: string;
  tour_slot_id: string;
  qty_adult: number;
  qty_child: number;
  total: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  eticket_pdf?: string;
  tourSlot?: TourSlot;
}

export interface Sponsor {
  id: string;
  name_ru: string;
  name_en?: string;
  logo?: string;
  website_url?: string;
  tier: string;
  is_active: boolean;
}

export interface Comment {
  id: string;
  article_id: string;
  user_id: string;
  content: string;
  is_approved: boolean;
  user?: Pick<User, 'id' | 'name'>;
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
  size?: string;
  flocage_name_ru?: string;
  flocage_number?: number;
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
