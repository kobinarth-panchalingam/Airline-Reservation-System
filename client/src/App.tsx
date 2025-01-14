import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { BrowserRouter, Route, Routes } from "react-router";
import classes from './App.module.css';
import { AuthenticationImage } from "./components/AuthenticationImage/AuthenticationImage";
import { NavbarNested } from "./components/NavbarNested/NavbarNested";
import { AircraftModels } from "./pages/AircraftModels/AircraftModels";
import { theme } from "./theme";

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <div className={classes.app}>
        <BrowserRouter>
          <Routes>
            <Route path="login" element={<AuthenticationImage />} />
            <Route path="admin" element={<NavbarNested />}>
              <Route path="aircraft-models" element={<AircraftModels/>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </MantineProvider>
  );
}