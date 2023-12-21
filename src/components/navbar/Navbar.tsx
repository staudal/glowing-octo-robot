import { Disclosure } from '@headlessui/react';
import Logo from './Logo';
import MainNav from './MainNav';
import MobileMenuButton from './MobileMenuButton';
import ProfileDropdown from './ProfileDropdown';
import MobileMainNav from './MobileMainNav';
import { supabase } from '../../utils';
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import LoginButton from './LoginButton';
import { useLocation } from 'react-router-dom';

const navigation = [
	{ name: 'Dashboard', href: '/', current: false },
	{ name: 'Settings', href: '/settings', current: false },
];

export default function Navbar() {
	const [session, setSession] = useState<Session | null>(null);

	const pathname = useLocation().pathname;

	useEffect(() => {
		const current = navigation.find(item => item.href === pathname);
		if (current) {
			navigation.forEach(item => {
				if (item.href === pathname) item.current = true;
				else item.current = false;
			});
		}
	}, [pathname]);

	useEffect(() => {
		async function getSession() {
			const { data, error } = await supabase.auth.getSession();
			if (error) console.log(error);
			if (data.session) setSession(data.session);
		}

		getSession();

		const { data: authListener } = supabase.auth.onAuthStateChange(async (_, session) => {
			setSession(session);
		});

		return () => {
			authListener?.subscription.unsubscribe();
		};
	}, [session]);

	return (
		<Disclosure as="nav" className="bg-gray-800">
			{({ open }: any) => (
				<>
					<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
						<div className="relative flex h-16 items-center justify-between">
							<MobileMenuButton open={open} />
							<div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
								<Logo />
								<MainNav navigation={navigation} />
							</div>
							<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
								{session ? <ProfileDropdown /> : <LoginButton />}
							</div>
						</div>
					</div>

					<MobileMainNav navigation={navigation} />
				</>
			)}
		</Disclosure>
	);
}
