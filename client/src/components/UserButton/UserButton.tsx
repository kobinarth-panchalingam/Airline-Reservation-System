import { IconChevronRight } from "@tabler/icons-react";
import { Avatar, Group, Text, UnstyledButton } from "@mantine/core";
import classes from "./UserButton.module.css";

export function UserButton() {
	return (
		<UnstyledButton className={classes.user}>
			<Group>
				<Avatar
					radius="xl"
					src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
				/>

				<div style={{ flex: 1 }}>
					<Text fw={500} size="sm">
						Harriette Spoonlicker
					</Text>

					<Text c="dimmed" size="xs">
						hspoonlicker@outlook.com
					</Text>
				</div>

				<IconChevronRight size={14} stroke={1.5} />
			</Group>
		</UnstyledButton>
	);
}
