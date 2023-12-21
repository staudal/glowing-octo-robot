import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import AddWishlistModal from '../components/wishlists/AddWishlistModal';
import { useNavigate } from 'react-router-dom';
import { WishlistWithWishes } from '../types/WishlistWithWishes';
import DeleteWishlistModal from '../components/wishlists/DeleteWishlistModal';

interface Props {
	getWishlists: (user_id: string) => void;
	wishlists: WishlistWithWishes[] | undefined;
	session: Session | null;
}

export default function DashboardRoute({ getWishlists, wishlists, session }: Props) {
	const [addWishlistModal, setAddWishlistModal] = useState(false);
	const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		if (session) {
			getWishlists(session.user.id);
		}
	}, [session]);

	if (!session) {
		return (
			<div className="flex flex-col items-center justify-center h-full">
				<p className="text-2xl font-semibold">You are not logged in.</p>
				<p className="text-lg text-gray-500">Please log in to view your dashboard.</p>
			</div>
		);
	}

	if (!wishlists) return <p>Loading...</p>;

	return (
		<div>
			<div className="sm:flex sm:items-center">
				<div className="sm:flex-auto">
					<h1 className="text-base font-semibold leading-6 text-gray-900">Your wishlists</h1>
					<p className="mt-2 text-sm text-gray-700">A list of all the wishlists you have created.</p>
				</div>
				<div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
					<button
						onClick={() => setAddWishlistModal(true)}
						type="button"
						className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>
						Add wishlist
					</button>
					<AddWishlistModal
						user={session.user}
						open={addWishlistModal}
						setOpen={setAddWishlistModal}
						getWishlists={() => getWishlists(session.user.id)}
					/>
				</div>
			</div>
			<div className="mt-8 flow-root">
				<div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
					<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
						<div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
							<table className="min-w-full divide-y divide-gray-300">
								<thead className="bg-gray-50">
									<tr>
										<th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
											#
										</th>
										<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
											Name
										</th>
										<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
											# of wishes
										</th>
										<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
											Avg. price
										</th>
										<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
											Created at
										</th>
										<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200 bg-white">
									{wishlists.map((wishlist, index) => (
										<tr key={wishlist.id}>
											<td className="whitespace-nowrap w-1 py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{index + 1}</td>
											<td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">{wishlist.name}</td>
											<td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">{wishlist.wishes.length}</td>
											<td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">
												{(() => {
													const prices = wishlist.wishes.map(wish => wish.price);
													if (prices.length === 0) {
														return '0 DKK';
													}
													const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
													return `${avg.toFixed(2)} DKK`;
												})()}
											</td>
											<td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">{wishlist.name}</td>
											<td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">
												{(() => {
													const date = new Date(wishlist.created_at);
													const day = date.toLocaleDateString('en-GB', { day: '2-digit' });
													const month = date.toLocaleDateString('en-GB', { month: 'short' });
													const year = date.toLocaleDateString('en-GB', { year: 'numeric' });
													return `${day}. ${month.toLowerCase()} ${year}`;
												})()}
											</td>
											<td className="whitespace-nowrap w-1 space-x-2 px-2 py-2 text-sm text-gray-500">
												<button
													onClick={() => navigate(`/wishlist/${wishlist.id}`)}
													className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:w-auto"
												>
													Select
												</button>
												<button
													onClick={() => setConfirmDeleteModal(true)}
													className="inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ring-gray-300 bg-red-600 hover:bg-red-700 sm:w-auto"
												>
													Delete
												</button>
												<DeleteWishlistModal
													wishlist={wishlist}
													open={confirmDeleteModal}
													setOpen={setConfirmDeleteModal}
													getWishlists={() => getWishlists(session.user.id)}
												/>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
