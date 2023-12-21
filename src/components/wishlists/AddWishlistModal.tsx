import { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { supabase } from '../../utils';
import toast from 'react-hot-toast';
import { Wishlist } from '../../types/Wishlist';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { User } from '@supabase/supabase-js';

interface Props {
	user: User;
	open: boolean;
	setOpen: (open: boolean) => void;
	getWishlists: () => void;
}

export default function AddWishlistModal({ user, open, setOpen, getWishlists }: Props) {
	const [name, setName] = useState('');
	const [isNameTouched, setIsNameTouched] = useState(false);
	const cancelButtonRef = useRef(null);
	const inputRef = useRef<HTMLInputElement>(null);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const toastId = toast.loading('Creating wishlist...');
		const { error } = await supabase.from('wishlists').insert([{ name, user_id: user.id }]);
		if (error) {
			toast.error('Error creating wishlist.', { id: toastId });
		} else {
			getWishlists();
			toast.success('Wishlist created successfully.', { id: toastId });
			setOpen(false);
			setName('');
			setIsNameTouched(false);
		}
	}

	useEffect(() => {
		if (open) {
			setTimeout(() => {
				inputRef.current?.focus();
			}, 100); // Add a delay before focusing
		}
	}, [open]);

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={() => {}}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
				</Transition.Child>

				<div className="fixed inset-0 z-10 overflow-y-auto">
					<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<Dialog.Panel className="w-full relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
								<form onSubmit={handleSubmit}>
									<div className="w-full">
										<Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900 bg-gray-50 p-4 text-center">
											Add new wishlist
										</Dialog.Title>
										<div className="space-y-4 p-4">
											<div className="relative">
												<label
													htmlFor="name"
													className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
												>
													Name
												</label>
												<input
													ref={inputRef}
													type="text"
													name="name"
													id="name"
													className={`block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ${
														name === '' && isNameTouched ? 'ring-red-500' : 'ring-gray-300'
													} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
													placeholder="Christmas 2023"
													onChange={e => {
														setName(e.target.value);
														setIsNameTouched(true);
													}}
													required
												/>
												{name.trim() === '' && isNameTouched && (
													<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
														<ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
													</div>
												)}
											</div>
										</div>
									</div>
									<div className="bg-gray-50 p-4 sm:flex sm:flex-row-reverse justify-between">
										<button
											type="submit"
											className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 sm:ml-3 sm:w-auto"
										>
											Add wishlist
										</button>
										<button
											type="button"
											className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
											onClick={() => ((setOpen(false), setName('')), setIsNameTouched(false))}
											ref={cancelButtonRef}
										>
											Cancel
										</button>
									</div>
								</form>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
