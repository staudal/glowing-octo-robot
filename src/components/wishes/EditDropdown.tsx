import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import DeleteWishModal from './DeleteWishModal';

interface Props {
	wish_link_url: string;
	wish_id: string;
	getWishlists: () => void;
}

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ');
}

export default function EditDropdown({ wish_link_url, wish_id, getWishlists }: Props) {
	const [deleteWishModal, setDeleteWishModal] = useState(false);

	return (
		<>
			<Menu as="div" className="absolute top-0 right-0 mt-2 mr-2">
				<div>
					<Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
						Options
						<ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
					</Menu.Button>
				</div>

				<Transition
					as={Fragment}
					enter="transition ease-out duration-100"
					enterFrom="transform opacity-0 scale-95"
					enterTo="transform opacity-100 scale-100"
					leave="transition ease-in duration-75"
					leaveFrom="transform opacity-100 scale-100"
					leaveTo="transform opacity-0 scale-95"
				>
					<Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
						<div className="p-1">
							<Menu.Item>
								{({ active }) => (
									<button
										onClick={() => window.open(wish_link_url, '_blank')}
										className={classNames(
											active ? 'bg-gray-100 text-gray-900 rounded-md' : 'text-gray-700',
											'w-full text-left block px-4 py-2 text-sm'
										)}
									>
										Open link
									</button>
								)}
							</Menu.Item>
							<Menu.Item>
								{({ active }) => (
									<button
										onClick={() => setDeleteWishModal(true)}
										className={classNames(
											active ? 'bg-gray-100 text-gray-900 rounded-md' : 'text-gray-700',
											'w-full text-left block px-4 py-2 text-sm'
										)}
									>
										Delete
									</button>
								)}
							</Menu.Item>
						</div>
					</Menu.Items>
				</Transition>
			</Menu>
			<DeleteWishModal wish_id={wish_id} open={deleteWishModal} setOpen={setDeleteWishModal} getWishlists={getWishlists} />
		</>
	);
}
