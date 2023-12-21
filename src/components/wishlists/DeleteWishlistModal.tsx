import { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { supabase } from '../../utils';
import { Wishlist } from '../../types/Wishlist';

interface Props {
	wishlist: Wishlist;
	open: boolean;
	setOpen: (open: boolean) => void;
	getWishlists: () => void;
}

export default function DeleteWishlistModal({ wishlist, open, setOpen, getWishlists }: Props) {
	const cancelButtonRef = useRef(null);

	async function handleDelete(id: string) {
		const toastId = toast.loading('Deleting wishlist...');
		const { error } = await supabase.from('wishlists').delete().eq('id', id);
		if (error) {
			toast.error('Error deleting wishlist.', { id: toastId });
		} else {
			getWishlists();
			setOpen(false);
			toast.success('Wishlist deleted successfully.', { id: toastId });
		}
	}

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

				<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
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
							<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
								<div className="bg-white p-4">
									<div className="sm:flex sm:items-center">
										<div className="text-center sm:text-left">
											<Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
												Delete wishlist
											</Dialog.Title>
											<div className="mt-2">
												<p className="text-sm text-gray-500">
													Are you sure you want to delete this wishlist? All wishes in this wishlist will be deleted as well.
												</p>
											</div>
										</div>
									</div>
								</div>
								<div className="justify-between bg-gray-50 p-4 sm:flex sm:flex-row-reverse">
									<button
										type="button"
										className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
										onClick={() => handleDelete(wishlist.id)}
									>
										Delete
									</button>
									<button
										type="button"
										className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
										onClick={() => setOpen(false)}
										ref={cancelButtonRef}
									>
										Cancel
									</button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
