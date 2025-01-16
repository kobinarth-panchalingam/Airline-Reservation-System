import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Route, Routes } from "react-router";
import { queryClient } from "./api/reactQuery";
import classes from "./App.module.css";
import { AuthenticationImage } from "./components/AuthenticationImage/AuthenticationImage";
import { NavbarNested } from "./components/NavbarNested/NavbarNested";
import { AircraftModels } from "./pages/AircraftModels/AircraftModels";
import { theme } from "./theme";

export default function App() {
	return (
		<MantineProvider theme={theme}>
			<QueryClientProvider client={queryClient}>
				<ModalsProvider>
					<div className={classes.app}>
						<BrowserRouter>
							<Routes>
								<Route element={<AuthenticationImage />} path="" />
								<Route element={<NavbarNested />} path="admin">
									<Route element={<AircraftModels />} path="aircraft-models" />
								</Route>
							</Routes>
						</BrowserRouter>
					</div>
				</ModalsProvider>
				<ReactQueryDevtools initialIsOpen={false} />
				<Notifications />
			</QueryClientProvider>
		</MantineProvider>
	);
}
