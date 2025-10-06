import { LoginCredentials, AuthResponse } from "../types/auth";
import { Vehicle, SearchParams } from "../types/vehicle";

const mockVehicles: Vehicle[] = [
  {
    vin: "1HGBH41JXMN109186",
    plate: "ABC1234",
    make: "Honda",
    model: "Accord",
    year: 2021,
    engineType: "2.0L Turbo",
  },
  {
    vin: "1HGBH41JXMN109187",
    plate: "XYZ5678",
    make: "Ford",
    model: "Fusion",
    year: 2020,
    engineType: "2.5L I4",
  },
  {
    vin: "1HGBH41JXMN109188",
    plate: "TES1234",
    make: "Tesla",
    model: "Model S",
    year: 2022,
    engineType: "Electric",
  },
  {
    vin: "WBAJA7C59HWG00001",
    plate: "BMW9999",
    make: "BMW",
    model: "3 Series",
    year: 2019,
    engineType: "2.0L Turbo I4",
  },
  {
    vin: "JM1BK32F781100001",
    plate: "MAZ5555",
    make: "Mazda",
    model: "CX-5",
    year: 2023,
    engineType: "2.5L I4",
  },
];

const mockUsers = [
  {
    email: "sales@wholesalecarparts.com.au",
    password: "sales1234",
    name: "Sales",
  },
];

export const mockLogin = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(
        (u) =>
          u.email === credentials.email && u.password === credentials.password
      );

      if (user) {
        resolve({
          accessToken: `mock-jwt-token-${Date.now()}`,
          user: {
            email: user.email,
            name: user.name,
          },
        });
      } else {
        reject(new Error("Invalid email or password"));
      }
    }, 800);
  });
};

export const mockSearchVehicles = async (
  params: SearchParams
): Promise<Vehicle[]> => {
  console.log(params);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let results: Vehicle[] = [];

      if (params.vin) {
        results = mockVehicles.filter((v) =>
          v.vin.toLowerCase().includes(params.vin!.toLowerCase())
        );
      } else if (params.plate) {
        results = mockVehicles.filter((v) =>
          v.plate.toLowerCase().includes(params.plate!.toLowerCase())
        );
      }

      resolve(results);
    }, 600);
  });
};
