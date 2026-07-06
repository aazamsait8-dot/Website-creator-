export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'starters' | 'mains' | 'desserts' | 'drinks';
  image: string;
  dietary: ('vegan' | 'gluten-free' | 'spicy' | 'vegetarian' | 'nut-free')[];
  rating: number;
  prepTime: string;
  popular: boolean;
  calories: number;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  seating: 'dining' | 'bar' | 'patio';
  notes?: string;
  status: 'confirmed' | 'pending';
  createdAt: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  dishName?: string;
}
