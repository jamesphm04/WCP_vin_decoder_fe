import "./App.css";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import SearchPage from "./pages/search/SearchPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { useEffect } from "react";
import { initializeAuth, setUnauthorizedHandler } from "./services/api";
import { useAppDispatch } from "./store/hooks";
import { logout, restoreAuth } from "./store/authSlice";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// Separate component to access Redux hooks
function AppContent() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = initializeAuth();
    if (token) {
      dispatch(restoreAuth({ token }));
    }

    setUnauthorizedHandler(() => {
      dispatch(logout());
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
