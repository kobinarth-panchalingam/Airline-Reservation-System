import { Box, Collapse, Group, ThemeIcon, UnstyledButton } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { useState } from "react";
import { Link } from "react-router";
import classes from "./NavbarLinksGroup.module.css";

interface LinksGroupProps {
	icon: React.FC<any>;
	label: string;
	initiallyOpened?: boolean;
	links?: Array<{ label: string; link: string }>;
}

export function LinksGroup({
	icon: Icon,
	label,
	initiallyOpened,
	links,
}: LinksGroupProps) {
	const hasLinks = Array.isArray(links);
	const [opened, setOpened] = useState(initiallyOpened || false);
	const items = (hasLinks ? links : []).map((link) => (
		<Link key={link.label} className={classes.link} to={link.link}>
			{link.label}
		</Link>
	));

	return (
		<>
			<UnstyledButton
				className={classes.control}
				onClick={() => {
					setOpened((o) => !o);
				}}
			>
				<Group gap={0} justify="space-between">
					<Box style={{ display: "flex", alignItems: "center" }}>
						<ThemeIcon size={30} variant="light">
							<Icon size={18} />
						</ThemeIcon>
						<Box ml="md">{label}</Box>
					</Box>
					{hasLinks && (
						<IconChevronRight
							className={classes.chevron}
							size={16}
							stroke={1.5}
							style={{ transform: opened ? "rotate(-90deg)" : "none" }}
						/>
					)}
				</Group>
			</UnstyledButton>
			{hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
		</>
	);
}
