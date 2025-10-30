import { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  MenuItem,
  Select,
} from "@mui/material";
import { Search } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  searchByVIN,
  searchByPlateAndState,
  clearError,
} from "../../store/searchSlice";
import Layout from "../../components/Layout";
import WCPChatbot from "../../components/WCPChatbot";

const SearchPage = () => {
  const dispatch = useAppDispatch();
  const { results, loading, error } = useAppSelector((state) => state.search);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [vin, setVin] = useState("");
  const [plate, setPlate] = useState("");
  const [state, setState] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!vin.trim() && !plate.trim()) {
      return;
    }

    if (plate.trim() && !state) {
      return;
    }

    if (vin.trim()) {
      await dispatch(searchByVIN(vin.trim()));
    } else if (plate.trim() && state) {
      await dispatch(searchByPlateAndState({ plate: plate.trim(), state }));
    }
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  const titleMapping: Record<string, string> = {
    vin: "VIN",
    make: "Make",
    model: "Model",
    grade: "Grade",
    series: "Series",
    description: "Description",
    body: "Body",
    doors: "Doors",
    seats: "Seats",
    engineCapacity: "Engine Capacity",
    engineConfig: "Engine Config",
    cylinderNo: "Cylinders",
    powerKW: "Power (kW)",
    fuel: "Fuel",
    transmission: "Transmission",
    numOfGears: "Gears",
    drivetrain: "Drivetrain",
    gvmKG: "GVM (kg)",
    tareMassKG: "Tare Mass (kg)",
    countryOfOrigin: "Country",
    combinedLitre100km: "Combined L/100km",
    co2CombinedGramKm: "CO₂ Combined (g/km)",
    year: "Year",
    cabType: "Cab Type",
    engine: "Engine",
    turbo: "Turbo",
    compliancePlate: "Compliance Plate",
    ktype: "K-Type",
  };

  const displayOrder = [
    "model",
    "vin",
    "year",
    "compliancePlate",
    "series",
    "cabType",
    "grade",
    "engine",
    "turbo",
    "powerKW",
    "ktype",
    "transmission",
    "drivetrain",
    "seats",
    "numOfGears",
    "cylinderNo",
    "doors",
    "body",
    "description",
    "engineCapacity",
    "fuel",
    "make",
    "engineConfig",
    "gvmKG",
    "tareMassKG",
    "countryOfOrigin",
    "combinedLitre100km",
    "co2CombinedGramKm",
  ];

  const isFormValid = vin.trim() !== "" || plate.trim() !== "";

  return (
    <Layout>
      {isAuthenticated && <WCPChatbot />}
      <Box sx={{ mx: "auto", width: "100%" }}>
        <Typography variant="h5" component="h1" fontWeight={600} gutterBottom>
          Vehicle Search
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          Search vehicle details by a VIN or a plate number **with State**
        </Typography>

        <Paper sx={{ p: 2, mb: 2 }}>
          <form onSubmit={handleSearch}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
                gap: 1,
                mb: 1,
              }}
            >
              <TextField
                label="VIN"
                value={vin}
                onChange={(e) => setVin(e.target.value)}
                disabled={loading}
                placeholder="e.g., MNALSAE107W707518"
              />

              <TextField
                label="Plate Number"
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                disabled={loading}
                placeholder="e.g., ABC1234"
              />
              <Select
                value={state}
                onChange={(e) => setState(e.target.value)}
                disabled={loading}
                displayEmpty
              >
                <MenuItem value="">Select State</MenuItem>
                <MenuItem value="NSW">New South Wales (NSW)</MenuItem>
                <MenuItem value="VIC">Victoria (VIC)</MenuItem>
                <MenuItem value="QLD">Queensland (QLD)</MenuItem>
                <MenuItem value="WA">Western Australia (WA)</MenuItem>
                <MenuItem value="SA">South Australia (SA)</MenuItem>
                <MenuItem value="TAS">Tasmania (TAS)</MenuItem>
                <MenuItem value="ACT">
                  Australian Capital Territory (ACT)
                </MenuItem>
                <MenuItem value="NT">Northern Territory (NT)</MenuItem>
              </Select>
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
        {!loading && results.length === 0 && !error && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Nothing to display. Please try different search criteria.
          </Alert>
        )}

        {error && (
          <Alert severity="error" onClose={handleClearError} sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && results.length === 0 && plate && !state && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Please select a state when searching by plate number.
          </Alert>
        )}
        {!loading && results.length > 0 && (
          <Paper sx={{ width: "100%", py: 1, px: 15 }}>
            {displayOrder.map((key) => (
              <Box
                key={key}
                sx={{
                  display: "flex",
                  borderBottom: "1px solid #eee",
                  py: 0.5,
                }}
              >
                <Typography
                  sx={{ fontWeight: 600, width: 400 }}
                  color="text.secondary"
                >
                  {titleMapping[key]}:
                </Typography>
                <Typography>
                  {(results[0] as Record<string, any>)[key] ?? "-"}
                </Typography>
              </Box>
            ))}
          </Paper>
        )}

        {/* {results.length > 0 && (
          <Paper sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={results}
              columns={columns}
              getRowId={(row) => row.vin}
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 5 },
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
        )} */}
      </Box>
    </Layout>
  );
};

export default SearchPage;
