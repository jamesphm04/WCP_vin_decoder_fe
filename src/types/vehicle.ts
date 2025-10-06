export interface Vehicle {
  vin: string;
  plate: string;
  make: string;
  model: string;
  year: number;
  engineType: string;
}

export interface SearchParams {
  vin?: string;
  plate?: string;
}
