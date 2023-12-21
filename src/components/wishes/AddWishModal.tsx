import { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { supabase } from '../../utils';
import toast from 'react-hot-toast';
import { Wishlist } from '../../types/Wishlist';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';

interface Props {
	wishlist: Wishlist;
	open: boolean;
	setOpen: (open: boolean) => void;
	getWishlists: () => void;
}

export default function AddWishModal({ wishlist, open, setOpen, getWishlists }: Props) {
	const [name, setName] = useState('');
	const [isNameTouched, setIsNameTouched] = useState(false);
	const [description, setDescription] = useState('');
	const [isDescriptionTouched, setIsDescriptionTouched] = useState(false);
	const [price, setPrice] = useState('');
	const [isPriceTouched, setIsPriceTouched] = useState(false);
	const [img_url, setImg_url] = useState('');
	const [isImg_urlTouched, setIsImg_urlTouched] = useState(false);
	const [validImg_url, setValidImg_url] = useState(false);
	const [link_url, setLink_url] = useState('');
	const [isLink_urlTouched, setIsLink_urlTouched] = useState(false);
	const [validLink_url, setValidLink_url] = useState(false);
	const cancelButtonRef = useRef(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const urlPattern = new RegExp(
		'^(https?:\\/\\/)?' + // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name and extension
			'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
			'(\\:\\d+)?' + // port
			'(\\/[-a-z\\d%_.~+]*)*' + // path
			'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
			'(\\#[-a-z\\d_]*)?$',
		'i'
	); // fragment locator

	const validateURL = (url: string) => {
		return urlPattern.test(url);
	};

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		// check if link_url is valid
		if (!validLink_url) {
			toast.error('Link URL is invalid.');
			return;
		} else if (!validImg_url) {
			toast.error('Image URL is invalid.');
			return;
		}

		const toastId = toast.loading('Creating wish...');
		const { error } = await supabase.from('wishes').insert({ name, description, price, img_url, link_url, wishlist_id: wishlist.id });
		if (error) {
			toast.error('Error creating wish.', { id: toastId });
		} else {
			getWishlists();
			toast.success('Wish created successfully.', { id: toastId });
			setOpen(false);
			setName('');
			setDescription('');
			setPrice('');
			setImg_url('');
			setLink_url('');
			setIsNameTouched(false);
			setIsDescriptionTouched(false);
			setIsPriceTouched(false);
			setIsImg_urlTouched(false);
			setIsLink_urlTouched(false);
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
											Add new wish
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
													placeholder="MacBook Air M1"
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
											<div className="relative">
												<label
													htmlFor="description"
													className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
												>
													Description
												</label>
												<textarea
													name="description"
													id="description"
													className={`block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ${
														description === '' && isDescriptionTouched ? 'ring-red-500' : 'ring-gray-300'
													} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 resize-none`}
													placeholder="I would like a MacBook Air M1 with 16GB of RAM and 512GB of storage."
													onChange={e => {
														setDescription(e.target.value);
														setIsDescriptionTouched(true);
													}}
													required
												/>
												{description.trim() === '' && isDescriptionTouched && (
													<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
														<ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
													</div>
												)}
											</div>
											<div className="relative">
												<label
													htmlFor="price"
													className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
												>
													Price
												</label>
												<input
													type="number"
													name="price"
													id="price"
													className={`block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ${
														price === '' && isPriceTouched ? 'ring-red-500' : 'ring-gray-300'
													} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
													placeholder="0.00"
													onChange={e => {
														setPrice(e.target.value);
														setIsPriceTouched(true);
													}}
													required
												/>
												{price.trim() === '' && isPriceTouched && (
													<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
														<ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
													</div>
												)}
											</div>
											<div className="relative">
												<label
													htmlFor="link_url"
													className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
												>
													Link URL
												</label>
												<input
													type="text"
													name="link_url"
													id="link_url"
													className={`block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ${
														isLink_urlTouched && !validLink_url ? 'ring-red-500' : 'ring-gray-300'
													} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
													placeholder="https://example.com"
													onChange={e => {
														setLink_url(e.target.value);
														setIsLink_urlTouched(true);
														setValidLink_url(validateURL(e.target.value));
													}}
													required
												/>
												{isLink_urlTouched && !validLink_url && (
													<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
														<ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
													</div>
												)}
											</div>
											<div className="relative">
												<label
													htmlFor="image_url"
													className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
												>
													Image URL
												</label>
												<input
													type="text"
													name="img_url"
													id="img_url"
													className={`block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ${
														isImg_urlTouched && !validImg_url ? 'ring-red-500' : 'ring-gray-300'
													} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
													placeholder="https://example.com/image.jpg"
													onChange={e => {
														setImg_url(e.target.value);
														setIsImg_urlTouched(true);
														setValidImg_url(validateURL(e.target.value));
													}}
													required
												/>
												{isImg_urlTouched && !validImg_url && (
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
											Add wish
										</button>
										<button
											type="button"
											className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
											onClick={() => (
												setOpen(false),
												setName(''),
												setDescription(''),
												setPrice(''),
												setImg_url(''),
												setLink_url(''),
												setIsNameTouched(false),
												setIsDescriptionTouched(false),
												setIsPriceTouched(false),
												setIsImg_urlTouched(false),
												setIsLink_urlTouched(false)
											)}
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
