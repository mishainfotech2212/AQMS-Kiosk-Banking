export type ApiBranch = { id: string; name: string };

export type KioskOrganization = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
};

/** Recursive service tree from get-services-by-branch */
export type ServiceTreeNode = {
  id: string;
  name: string;
  estimated_wait_minutes?: number | null;
  children: ServiceTreeNode[];
};

export type GenerateTokenPayload = {
  branch_id: string;
  service_id: string;
  counter_id: string | null;
  served_by: string | null;
  customer_name: string;
  customer_phone: string;
  priority: number;
  source: string;
  auto_assign: boolean;
  notes: string;
};

export type CreateTicketResult = {
  ticketId: string;
  ticketNumber: string;
  ticketDate: string;
  branchName?: string;
  serviceName?: string;
  waitTimeLabel?: string;
  estimatedServiceTime?: string;
  qrCodeUrl?: string | null;
};

/** @deprecated UI legacy shape; use ServiceTreeNode[] */
export type KioskServiceItem = { id: string; name: string };

/** @deprecated */
export type KioskServiceGroup = {
  id: string;
  title: string;
  icon: 'card' | 'wallet' | 'document-text';
  items: KioskServiceItem[];
};
