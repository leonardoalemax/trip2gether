import React from "react";
import { ScreenType } from "../../types";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface LayoutProps {
	activeScreen: ScreenType;
	onScreenChange: (screen: ScreenType) => void;
	onPrimary: () => void;
	children: React.ReactNode;
}

export default function Layout({
	activeScreen,
	onScreenChange,
	onPrimary,
	children,
}: LayoutProps) {
	return (
		<div className='drawer lg:drawer-open' style={{ height: "100vh" }}>
			<input
				id='drawer-toggle'
				type='checkbox'
				className='drawer-toggle'
			/>
			<div className='drawer-content flex flex-col h-screen overflow-hidden'>
				<Navbar activeScreen={activeScreen} onPrimary={onPrimary} />
				<div className='flex-1 overflow-y-auto p-4 lg:p-6'>
					{children}
				</div>
			</div>
			<Sidebar
				activeScreen={activeScreen}
				onScreenChange={onScreenChange}
			/>
		</div>
	);
}
