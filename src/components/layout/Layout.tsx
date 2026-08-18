import React from "react";
import { ScreenType } from "../../types";
import Header from "./Header";
import { LAYOUT_NAV_ITEMS } from "./navItems";

interface LayoutProps {
	activeScreen: ScreenType;
	onScreenChange: (screen: ScreenType) => void;
	onPrimary: () => void;
	children: React.ReactNode;
}

export default function Layout({
	activeScreen,
	onScreenChange,
	children,
}: LayoutProps) {
	return (
		<div className='h-screen flex flex-col overflow-hidden'>
			<Header
				activeScreen={activeScreen}
				onScreenChange={onScreenChange}
			/>
			{/* Subheader de navegação — apenas desktop */}
			<div className='hidden md:block border-b border-base-200 bg-base-100/95 backdrop-blur supports-backdrop-filter:bg-base-100/80'>
				<nav className='px-4 lg:px-6'>
					<ul className='menu menu-horizontal p-0 gap-1 flex-nowrap'>
						{LAYOUT_NAV_ITEMS.map((item) => (
							<li key={item.id}>
								<a
									className={`text-sm rounded-none border-b-2 py-2.5 px-3 transition-colors ${
										activeScreen === item.id
											? "border-primary text-primary font-semibold"
											: "border-transparent text-base-content/60 hover:text-base-content"
									}`}
									style={{ cursor: "pointer" }}
									onClick={() => onScreenChange(item.id)}>
									<span className='text-base leading-none'>
										{item.emoji}
									</span>
									{item.label}
								</a>
							</li>
						))}
					</ul>
				</nav>
			</div>
			<main className='flex-1 overflow-y-auto px-4 lg:px-6 pb-24 md:pb-6 pt-0'>
				{children}
			</main>
			<footer className='md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-base-200 bg-base-100/95 backdrop-blur supports-backdrop-filter:bg-base-100/80'>
				<nav
					className='grid p-1'
					style={{
						gridTemplateColumns: `repeat(${LAYOUT_NAV_ITEMS.length}, minmax(0, 1fr))`,
					}}>
					{LAYOUT_NAV_ITEMS.map((item) => (
						<button
							key={item.id}
							type='button'
							onClick={() => onScreenChange(item.id)}
							aria-label={item.label}
							className={`py-1.5 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-colors ${
								activeScreen === item.id
									? "bg-primary/15 text-primary"
									: "text-base-content/60"
							}`}>
							<span className='text-xl leading-none'>
								{item.emoji}
							</span>
							<span className='text-[10px] leading-none font-medium truncate w-full text-center px-0.5'>
								{item.label}
							</span>
						</button>
					))}
				</nav>
			</footer>
		</div>
	);
}
