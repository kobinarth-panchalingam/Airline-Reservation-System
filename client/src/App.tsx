import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { AuthenticationImage } from "./components/AuthenticationImage/AuthenticationImage";
import { NavbarNested } from "./components/NavbarNested/NavbarNested";
import { AircraftModels } from "./pages/AircraftModels/AircraftModels";
import classes from "./App.module.css";
import { theme } from "./theme";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";

const queryClient = new QueryClient();

export default function App() {
	return (
		<MantineProvider theme={theme}>
			<QueryClientProvider client={queryClient}>
				<ModalsProvider>
					<div className={classes.app}>
						<BrowserRouter>
							<Routes>
								<Route element={<AuthenticationImage />} path="login" />
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
