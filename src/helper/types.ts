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
  customer_currency_type?: string;
  account_details?: string;
  address?: string;
}

interface Receiver {
  id?: number;
  full_name: string;
  phone?: string;
  signature: string;
  role?: string;
  account_details?: string;
  address?: string;
  receiver_is_payer?: boolean;
}

interface Sender {
  id?: number;
  full_name: string;
  phone?: string;
  signature: string;
  role?: string;
  sender_is_payer?: boolean;
}

interface Characteristic {
  cargo_cost: number;
  sender_city: any;
  receiver_city: any;
  additional_info: string;
  receiver_address: string;
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
  plane_id: string;
  partner_id: string;
  train_id: string;
}

interface VehicleData {
  auto_info: string;
  license_plate: string;
}

interface CargoInfo {
  issued: string | number;
  accepted: string | number;
  issued_phone: string;
  accepted_phone: string;
  date: string; // ISO Date string
}

interface Transportation {
  sender: string;
  receiver: string;
  sender_is_payer: boolean;
}

interface AccountDetails {
  bin: string;
  bik: string;
  address?: string;
  number_check?: string;
  kbe?: string;
  director?: string;
  contacts?: string;
  currency?: string;
  name_bank?: string;
}

export interface Act {
  qr_code: { qr: string };
  number?: string;
  id?: number;
  status?: string;
  customer_data: Customer;
  sender_data: Sender;
  characteristic: Characteristic;
  cargo: Cargo[];
  cargo_images: CargoImage[];
  transportation_type: string;
  cargo_characteristics: string;
  cargo_weights: string;
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
  transportation?: Transportation;
  accountant_photo: CargoImage[];
  receiver_account_details: AccountDetails;
  sender_account_details?: AccountDetails;
}

export interface ExpenseItem {
  id: number;
  name: string | number;
  quantity: number;
  price: string;
  total_cost: string;
}

export interface TransportationQuantityService {
  id: number;
  name: string;
  quantity: string;
  price: string;
}

export interface TableRow {
  number?: string;
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
  is_smr?: boolean;
}

export interface AccountantTableRow {
  number?: string;
  has_esf: boolean;
  has_avr: boolean;
  id: string;
  customer: Customer;
  created_at: string;
  cargo: Cargo;
  status: string;
  statusColor: string;
  view: string;
  total_cost: string;
  esf?: string;
  avr?: string;
  accountant_photo?: string;
  processed?: boolean;
  expense_is_confirmed?: boolean;
  expense_is_paid?: boolean;
}

export interface Status {
  key: string;
  value: string;
}
