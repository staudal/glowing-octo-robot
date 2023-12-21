import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LayoutRoute from './routes/Layout';
import DashboardRoute from './routes/Dashboard';
import NotFoundRoute from './routes/NotFound';
import SettingsRoute from './routes/Settings';
import WishlistRoute from './routes/Wishlist';
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './utils';
import { WishlistWithWishes } from './types/WishlistWithWishes';

function App() {
	const [loading, setLoading] = useState(true);
	const [session, setSession] = useState<Session | null>(null);
	const [wishlists, setWishlists] = useState<WishlistWithWishes[]>();

	async function getWishlists(user_id: string) {
		const { data, error } = await supabase.from('wishlists').select('*').eq('user_id', user_id);
		if (error) console.log('Error fetching wishlists: ', error);
		if (data) {
			const wishlistsWithWishes: WishlistWithWishes[] = [];
			for (const wishlist of data) {
				const { data: wishes } = await supabase.from('wishes').select('*').eq('wishlist_id', wishlist.id);
				if (wishes) {
					wishlistsWithWishes.push({ ...wishlist, wishes });
				}
			}
			setWishlists(wishlistsWithWishes);
		}
	}

	useEffect(() => {
		async function getSession() {
			const { data, error } = await supabase.auth.getSession();
			if (error) console.log('Error getting session: ', error);
			if (data.session) {
				setSession(data.session);
				getWishlists(data.session.user.id);
				setLoading(false);
			}
		}

		getSession();

		const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
			setSession(session);
			setLoading(false);
		});

		return () => {
			authListener?.subscription.unsubscribe();
		};
	}, []);

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<LayoutRoute />}>
					<Route index element={<DashboardRoute getWishlists={getWishlists} wishlists={wishlists} session={session} />} />
					<Route path="settings" element={<SettingsRoute />} />
					<Route path="wishlist/:id" element={<WishlistRoute getWishlists={getWishlists} wishlists={wishlists} session={session} />} />
					<Route path="*" element={<NotFoundRoute />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
