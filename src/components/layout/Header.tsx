import { ScreenType } from "../../types";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import NavItem from "./children/NavItem";
import TripSelector from "../trips/Selector/TripSelector";
import { LAYOUT_NAV_ITEMS } from "./navItems";

interface HeaderProps {
	activeScreen: ScreenType;
	onScreenChange: (screen: ScreenType) => void;
}

export default function Header({ activeScreen, onScreenChange }: HeaderProps) {
	const [user] = useAuthState(auth);

	const handleLogout = async () => {
		await signOut(auth);
	};

	const userInitials = user?.displayName
		? user.displayName
				.split(" ")
				.slice(0, 2)
				.map((n) => n[0])
				.join("")
				.toUpperCase()
		: (user?.email?.[0] ?? "?").toUpperCase();

	return (
		<header className='relative z-40 border-b border-base-200 bg-base-100/95 backdrop-blur supports-backdrop-filter:bg-base-100/80'>
			<div className='px-4 lg:px-6 py-3'>
				<div className='hidden md:flex items-center gap-3'>
					<div className='w-full max-w-md'>
						<TripSelector variant='desktop-inline' />
					</div>

					<nav className='flex-1 min-w-0'>
						<ul className='menu menu-horizontal rounded-lg bg-base-200/60 p-1 w-full overflow-x-auto flex-nowrap gap-1'>
							{LAYOUT_NAV_ITEMS.map((item) => (
								<NavItem
									key={item.id}
									id={item.id}
									label={item.label}
									icon={item.icon}
									isActive={activeScreen === item.id}
									onClick={onScreenChange}
								/>
							))}
						</ul>
					</nav>

					<div className='dropdown dropdown-end'>
						<button
							type='button'
							className='btn btn-ghost h-auto min-h-0 px-2 py-1.5 rounded-lg border border-base-200 bg-base-100'>
							<div className='flex items-center gap-2'>
								<div className='avatar'>
									{user?.photoURL ? (
										<div className='w-7 rounded-full'>
											<img
												src={user.photoURL}
												alt={
													user.displayName ?? "avatar"
												}
												referrerPolicy='no-referrer'
											/>
										</div>
									) : (
										<div className='placeholder'>
											<div className='bg-primary text-primary-content rounded-full w-7 text-xs flex items-center justify-center'>
												<span>{userInitials}</span>
											</div>
										</div>
									)}
								</div>
								<div className='overflow-hidden max-w-40 text-left'>
									<p className='text-xs font-medium truncate'>
										{user?.displayName ?? "Usuário"}
									</p>
									<p className='text-xs text-base-content/40 truncate'>
										{user?.email ?? ""}
									</p>
								</div>
							</div>
						</button>
						<ul className='dropdown-content menu mt-2 z-70 p-2 shadow bg-base-100 rounded-box w-40 border border-base-200'>
							<li>
								<button type='button' onClick={handleLogout}>
									Sair
								</button>
							</li>
						</ul>
					</div>
				</div>

				<div className='md:hidden flex items-center justify-between'>
					<TripSelector variant='mobile-flag' />
					<div className='dropdown dropdown-end'>
						<button type='button' className='avatar'>
							{user?.photoURL ? (
								<div className='w-9 rounded-full ring-1 ring-base-300'>
									<img
										src={user.photoURL}
										alt={user.displayName ?? "avatar"}
										referrerPolicy='no-referrer'
									/>
								</div>
							) : (
								<div className='placeholder'>
									<div className='bg-primary text-primary-content rounded-full w-9 text-xs flex items-center justify-center'>
										<span>{userInitials}</span>
									</div>
								</div>
							)}
						</button>
						<ul className='dropdown-content menu mt-2 z-70 p-2 shadow bg-base-100 rounded-box w-40 border border-base-200'>
							<li>
								<button type='button' onClick={handleLogout}>
									Sair
								</button>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</header>
	);
}
