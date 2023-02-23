export interface Recipient {
  name: string;
  email: string;
  address1?: string;
  state?: string;
  city?: string;
  zip?: string;
  phone?: string;
}

export interface Item {
  title: string;
  unit_cost: number;
  quantity: number;
}
