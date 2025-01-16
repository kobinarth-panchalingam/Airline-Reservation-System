import { IconChevronRight } from "@tabler/icons-react";
import { Avatar, Group, Text, UnstyledButton } from "@mantine/core";
import classes from "./UserButton.module.css";
import { useUser } from "../../context/UserContext";

export function UserButton() {
	const { user, setUser } = useUser();
	return (
		<UnstyledButton className={classes.user}>
			<Group>
				<Avatar
					radius="xl"
					src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
				/>

				<div style={{ flex: 1 }}>
					<Text fw={500} size="sm">
						{user?.name}
					</Text>

					<Text c="dimmed" size="xs">
						{user?.email}
					</Text>
				</div>

				<IconChevronRight size={14} stroke={1.5} />
			</Group>
		</UnstyledButton>
	);
}
