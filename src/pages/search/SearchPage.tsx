import { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Search } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { searchVehicles, clearError } from "../../store/searchSlice";
import { mockSearchVehicles } from "../../services/mockApi";
import Layout from "../../components/Layout";

const SearchPage = () => {
  const dispatch = useAppDispatch();
  const { results, loading, error } = useAppSelector((state) => state.search);

  const [vin, setVin] = useState("");
  const [plate, setPlate] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!vin.trim() && !plate.trim()) {
      return;
    }

    try {
      const searchParams = {
        vin: vin.trim(),
        plate: plate.trim(),
      };
      const response = await mockSearchVehicles(searchParams);
      dispatch(searchVehicles.fulfilled(response, "", searchParams));
    } catch (error: any) {
      dispatch(searchVehicles.rejected(null, "", {}, error.message));
    }
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  const columns: GridColDef[] = [
    {
      field: "vin",
      headerName: "VIN",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "plate",
      headerName: "Plate",
      flex: 0.7,
      minWidth: 120,
    },
    {
      field: "make",
      headerName: "Make",
      flex: 0.7,
      minWidth: 100,
    },
    {
      field: "model",
      headerName: "Model",
      flex: 0.8,
      minWidth: 120,
    },
    {
      field: "year",
      headerName: "Year",
      flex: 0.5,
      minWidth: 80,
    },
    {
      field: "engineType",
      headerName: "Engine Type",
      flex: 0.9,
      minWidth: 140,
    },
  ];

  const isFormValid = vin.trim() !== "" || plate.trim() !== "";

  return (
    <Layout>
      <Box sx={{ maxWidth: 1400, mx: "auto", width: "100%" }}>
        <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
          Vehicle Search
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Search for vehicle information using VIN or Plate number
        </Typography>

        <Paper sx={{ p: 3, mb: 4 }}>
          <form onSubmit={handleSearch}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 2,
                mb: 3,
              }}
            >
              <TextField
                label="VIN Number"
                value={vin}
                onChange={(e) => setVin(e.target.value)}
                disabled={loading}
                placeholder="e.g., 1HGBH41JXMN109186"
                helperText="Enter VIN to search"
              />
              <TextField
                label="Plate Number"
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                disabled={loading}
                placeholder="e.g., ABC1234"
                helperText="Or enter Plate number"
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={!isFormValid || loading}
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <Search size={20} />
                )
              }
              sx={{
                px: 4,
                py: 1.2,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
              }}
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </form>
        </Paper>

        {error && (
          <Alert severity="error" onClose={handleClearError} sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && results.length === 0 && (vin || plate) && (
          <Alert severity="info" sx={{ mb: 3 }}>
            No vehicles found matching your search criteria.
          </Alert>
        )}

        {results.length > 0 && (
          <Paper sx={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={results}
              columns={columns}
              getRowId={(row) => row.vin}
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
              disableRowSelectionOnClick
              sx={{
                "& .MuiDataGrid-cell:focus": {
                  outline: "none",
                },
                "& .MuiDataGrid-columnHeader:focus": {
                  outline: "none",
                },
              }}
            />
          </Paper>
        )}
      </Box>
    </Layout>
  );
};

export default SearchPage;
