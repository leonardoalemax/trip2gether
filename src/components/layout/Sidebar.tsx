import { ScreenType } from "../../types";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import NavItem from "./children/NavItem";
import TripSelector from "../trips/Selector/TripSelector";

interface SidebarProps {
	activeScreen: ScreenType;
	onScreenChange: (screen: ScreenType) => void;
}

export default function Sidebar({
	activeScreen,
	onScreenChange,
}: SidebarProps) {
	const [user] = useAuthState(auth);

	const userInitials = user?.displayName
		? user.displayName
				.split(" ")
				.slice(0, 2)
				.map((n) => n[0])
				.join("")
				.toUpperCase()
		: (user?.email?.[0] ?? "?").toUpperCase();

	return (
		<div className='drawer-side z-40'>
			<label htmlFor='drawer-toggle' className='drawer-overlay' />
			<aside className='bg-base-100 border-r border-base-200 w-52 flex flex-col h-full'>
				<TripSelector />
				<ul className='menu menu-sm p-2 flex-1 gap-0.5'>
					<NavItem
						id='calendar'
						label='Calendário'
						icon='calendar'
						isActive={activeScreen === "calendar"}
						onClick={onScreenChange}
					/>
					<NavItem
						id='tickets'
						label='Passagens Aéreas'
						icon='tickets'
						isActive={activeScreen === "tickets"}
						onClick={onScreenChange}
					/>
					<NavItem
						id='reservations'
						label='Reservas'
						icon='reservations'
						isActive={activeScreen === "reservations"}
						onClick={onScreenChange}
					/>
				</ul>
				<div className='p-3 border-t border-base-200'>
					<div className='flex items-center gap-2 rounded-lg p-1.5'>
						<div className='avatar'>
							{user?.photoURL ? (
								<div className='w-7 rounded-full'>
									<img
										src={user.photoURL}
										alt={user.displayName ?? "avatar"}
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
						<div className='overflow-hidden'>
							<p className='text-xs font-medium truncate'>
								{user?.displayName ?? "Usuário"}
							</p>
							<p className='text-xs text-base-content/40 truncate'>
								{user?.email ?? ""}
							</p>
						</div>
					</div>
				</div>
			</aside>
		</div>
	);
}
