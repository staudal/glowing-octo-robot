import { Wish } from './Wish';
import { Wishlist } from './Wishlist';

export interface WishlistWithWishes extends Wishlist {
	wishes: Wish[];
}
