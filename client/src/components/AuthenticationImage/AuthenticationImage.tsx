import {
	Anchor,
	Button,
	Checkbox,
	Paper,
	PasswordInput,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import classes from "./AuthenticationImage.module.css";

export function AuthenticationImage() {
	return (
		<div className={classes.wrapper}>
			<Paper className={classes.form} p={30} radius={0}>
				<Title className={classes.title} mb={50} mt="md" order={2} ta="center">
					Welcome back to Mantine!
				</Title>

				<TextInput
					label="Email address"
					placeholder="hello@gmail.com"
					size="md"
				/>
				<PasswordInput
					label="Password"
					mt="md"
					placeholder="Your password"
					size="md"
				/>
				<Checkbox label="Keep me logged in" mt="xl" size="md" />
				<Button fullWidth mt="xl" size="md">
					Login
				</Button>

				<Text mt="md" ta="center">
					Don&apos;t have an account?{" "}
					<Anchor<"a">
						fw={700}
						href="#"
						onClick={(event) => { event.preventDefault(); }}
					>
						Register
					</Anchor>
				</Text>
			</Paper>
		</div>
	);
}
