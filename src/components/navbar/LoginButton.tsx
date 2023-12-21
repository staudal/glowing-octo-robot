import { supabase } from '../../utils';

export default function LoginButton() {
	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: window.location.origin,
			},
		});
	}
	return (
		<form onSubmit={handleSubmit}>
			<button
				type="submit"
				className="rounded-md px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors duration-200"
			>
				Login
			</button>
		</form>
	);
}
