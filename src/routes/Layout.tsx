import { Outlet } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import { Toaster } from 'react-hot-toast';

export default function LayoutRoute() {
	return (
		<>
			<Navbar />
			<main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6 lg:mt-8">
				<Outlet />
			</main>
			<Toaster />
		</>
	);
}
