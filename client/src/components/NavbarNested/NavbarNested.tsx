import { Box, Code, Group, ScrollArea } from "@mantine/core";
import {
	IconAdjustments,
	IconBuildingAirport,
	IconCalendarStats,
	IconFileAnalytics,
	IconGauge,
	IconLock,
	IconNotes,
	IconPresentationAnalytics,
} from "@tabler/icons-react";
import { LinksGroup } from "../NavbarLinksGroup/NavbarLinksGroup";
import { UserButton } from "../UserButton/UserButton";
import classes from "./NavbarNested.module.css";
import { Outlet } from "react-router";

const mockdata = [
	{ label: "Dashboard", icon: IconGauge },
	{
		label: "Aircraft Management",
		icon: IconNotes,
		initiallyOpened: true,
		links: [
			{ label: "Aircraft Models", link: "aircraft-models" },
			{ label: "Flights", link: "flights" },
			{ label: "Airplanes", link: "" },
		],
	},
	{
		label: "Releases",
		icon: IconCalendarStats,
		links: [
			{ label: "Upcoming releases", link: "" },
			{ label: "Previous releases", link: "" },
			{ label: "Releases schedule", link: "" },
		],
	},
	{ label: "Analytics", icon: IconPresentationAnalytics },
	{ label: "Contracts", icon: IconFileAnalytics },
	{ label: "Settings", icon: IconAdjustments },
	{
		label: "Security",
		icon: IconLock,
		links: [
			{ label: "Enable 2FA", link: "" },
			{ label: "Change password", link: "" },
			{ label: "Recovery codes", link: "" },
		],
	},
];

export function NavbarNested() {
	const links = mockdata.map((item) => (
		<LinksGroup {...item} key={item.label} />
	));

	return (
		<div className={classes.layout}>
			<nav className={classes.navbar}>
				<div className={classes.header}>
					<Group justify="space-between">
						<Group>
							<IconBuildingAirport size={30} />
							<Box ml="md"> BAIRWAYS </Box>
						</Group>
						<Code fw={700}>v3.1.2</Code>
					</Group>
				</div>

				<ScrollArea className={classes.links}>
					<div className={classes.linksInner}>{links}</div>
				</ScrollArea>

				<div className={classes.footer}>
					<UserButton />
				</div>
			</nav>
			<div className={classes.mainContent}>
				<Outlet />
			</div>
		</div>
	);
}
