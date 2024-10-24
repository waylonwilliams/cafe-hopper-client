import { Tabs } from "expo-router";
import React from "react";
import { TabBar } from "../../components/TabBar";

import { TabBarIcon } from "@/components/TabBarIcon";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
			}}
			tabBar={(props) => <TabBar {...props} />}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					// This title is displayed on the tab
				}}
			/>

			<Tabs.Screen
				name="explore"
				options={{
					title: "Explore",
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
				}}
			/>
			{/* Exclude cafe.tsx from Tabs */}
		</Tabs>
	);
}
