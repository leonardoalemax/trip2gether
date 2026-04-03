import React from "react";
import { ScreenType } from "../../types";
import Header from "./Header";
import AppIcon from "../Icons/AppIcon";
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
			<main className='flex-1 overflow-y-auto px-4 lg:px-6 pb-24 md:pb-6 pt-0'>
				{children}
			</main>
			<footer className='md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-base-200 bg-base-100/95 backdrop-blur supports-backdrop-filter:bg-base-100/80'>
				<nav className='grid grid-cols-4 p-1'>
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
							<AppIcon
								name={item.icon}
								className='h-5 w-5 shrink-0'
							/>
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
