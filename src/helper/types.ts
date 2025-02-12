export interface Route {
  path: string;
  name: string;
  icon: string;
  submenu?: Route[];
  count?: number;
  highlight?: boolean;
  roles?: string[];
}

export interface ActDataProps {
  data: Act | null;
  setData: any;
}

export interface City {
  id: number;
  country: string;
  name_ru: string;
  name_kz: string;
  name_en: string;
}
interface Customer {
  id: number;
  full_name: string;
  phone?: string;
  signature: string;
  customer_is_payer: boolean;
  role?: string;
}

interface Receiver {
  id?: number;
  full_name: string;
  phone?: string;
  signature: string;
  role?: string;
}

interface Characteristic {
  cargo_cost: number;
  sender_city: any;
  receiver_city: any;
  additional_info: string;
}

interface Dimension {
  length: number;
  width: number;
  height: number;
  amount: number;
}

interface Cargo {
  characteristics: string;
  slots: number;
  weight: number;
  volume?: number;
  dimensions: Dimension;
}

export interface CargoImage {
  image: string | File | Blob;
}

interface DriverData {
  full_name: string;
  id_card_number: string;
  technical_passport: string;
}

interface VehicleData {
  auto_info: string;
  state_number: string;
}

interface CargoInfo {
  issued: string;
  accepted: string;
  date: string; // ISO Date string
}

export interface Act {
  number: string;
  id?: number;
  status?: string;
  customer_data: Customer;
  characteristic: Characteristic;
  cargo: Cargo[];
  cargo_images: CargoImage[];
  transportation_type: string;
  driver_data: DriverData;
  vehicle_data: VehicleData;
  packaging_is_damaged: boolean | null;
  contract_original_act: string | null;
  receiver_data: Receiver;
  receiving_cargo_info: CargoInfo;
  contract_mercenary_and_warehouse: string | null;
  transportation_services?: number[]; // Add specific type if needed
  transportation_service_ids?: number[]; // Add specific type if needed
  delivery_cargo_info: CargoInfo;
  accounting_esf: string | null;
  accounting_avr: string | null;
  cargo_status: string;
}

export interface TableRow {
  id: string;
  customer: string;
  created_at: string;
  cargo: Cargo;
  status: string;
  statusColor: string;
  view: string;
  total_cost: string;
  esf?: string;
  avr?: string;
  invoice?: string;
  processed?: boolean;
}
