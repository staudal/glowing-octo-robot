import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Wish } from '../types/Wish';
import { Wishlist } from '../types/Wishlist';
import AddWishModal from '../components/wishes/AddWishModal';
import EditDropdown from '../components/wishes/EditDropdown';
import { WishlistWithWishes } from '../types/WishlistWithWishes';
import { Session } from '@supabase/supabase-js';

interface Props {
	getWishlists: (user_id: string) => void;
	wishlists: WishlistWithWishes[];
	session: Session;
}

export default function WishlistRoute({ getWishlists, wishlists, session }: Props) {
	const [wishlist, setWishlist] = useState<Wishlist>();
	const [wishes, setWishes] = useState<Wish[]>([]);
	const [addWishModal, setAddWishModal] = useState(false);
	const { id } = useParams();

	useEffect(() => {
		if (id) {
			const wishlist = wishlists.find(wishlist => wishlist.id === id);
			if (wishlist) {
				setWishlist(wishlist);
				setWishes(wishlist.wishes);
			}
		}
	}, [wishlists, id]);

	if (!wishlist || !wishes) return <p>Loading...</p>;

	return (
		<div>
			<div className="sm:flex sm:items-center">
				<div className="sm:flex-auto">
					<h1 className="text-base font-semibold leading-6 text-gray-900">{wishlist.name}</h1>
					<p className="mt-2 text-sm text-gray-700">A list of all the wishes in this wishlist.</p>
				</div>
				<div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
					<button
						onClick={() => setAddWishModal(true)}
						type="button"
						className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>
						Add wish
					</button>
					<AddWishModal wishlist={wishlist} open={addWishModal} setOpen={setAddWishModal} getWishlists={() => getWishlists(session.user.id)} />
				</div>
			</div>
			<div className="md:grid md:grid-cols-3 gap-6 mt-6">
				{wishes.map(wish => (
					<div key={wish.id} className="bg-white border rounded-lg overflow-hidden relative">
						<EditDropdown wish_link_url={wish.link_url} wish_id={wish.id} getWishlists={() => getWishlists(session.user.id)} />
						<img className="w-full md:h-56 h-80 object-cover object-center" src={wish.img_url} alt="avatar" />
						<div className="p-5 space-y-1">
							<h1 className="text-md font-semibold text-gray-800 line-clamp-1">{wish.name}</h1>
							<p className="text-sm text-gray-500 line-clamp-2">{wish.description}</p>
						</div>
						<div className="flex justify-between border-t px-5 py-4 text-gray-500 text-sm line-clamp-1">
							<a href={wish.link_url} target="_blank" rel="noreferrer">
								{new URL(wish.link_url).hostname.replace('www.', '')}
							</a>
							<p className="">{new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK' }).format(wish.price)}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
