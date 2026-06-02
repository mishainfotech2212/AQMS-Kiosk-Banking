import type {
  ApiBranch,
  CreateTicketResult,
  KioskOrganization,
  ServiceTreeNode,
} from '@/services/api/types';

function isObj(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null;
}

export function isSupabaseSuccess(data: unknown): boolean {
  if (!isObj(data)) return false;
  return data.success === true;
}

export function mapErrorMessage(data: unknown): string | null {
  if (!isObj(data)) return null;
  const d = data as Record<string, unknown>;
  const msg = d.message ?? d.error ?? d.msg;
  return typeof msg === 'string' ? msg : null;
}

export function mapOrganization(data: unknown): KioskOrganization | null {
  if (!isObj(data)) return null;
  const o = data.organization;
  if (!isObj(o)) return null;
  const r = o as Record<string, unknown>;
  return {
    id: String(r.id ?? ''),
    name: String(r.name ?? ''),
    slug: String(r.slug ?? ''),
    logo_url: typeof r.logo_url === 'string' ? r.logo_url : null,
    primary_color: typeof r.primary_color === 'string' ? r.primary_color : null,
    secondary_color: typeof r.secondary_color === 'string' ? r.secondary_color : null,
  };
}

export function mapBranchesFromValidate(data: unknown): ApiBranch[] {
  if (!isObj(data)) return [];
  const arr = data.branches;
  if (!Array.isArray(arr)) return [];
  return arr
    .map((row) => {
      if (!isObj(row)) return { id: '', name: '' };
      const r = row as Record<string, unknown>;
      return {
        id: String(r.id ?? ''),
        name: String(r.name ?? ''),
      };
    })
    .filter((b) => b.id.length > 0);
}

function mapOneServiceNode(raw: unknown): ServiceTreeNode | null {
  if (!isObj(raw)) return null;
  const r = raw as Record<string, unknown>;
  const id = String(r.id ?? '');
  if (!id) return null;
  const name = String(r.name ?? '');
  const parentServiceId =
    typeof r.parent_service_id === 'string' && r.parent_service_id.trim() !== ''
      ? r.parent_service_id
      : null;
  const wait =
    typeof r.estimated_wait_minutes === 'number' ? r.estimated_wait_minutes : null;
  let childrenRaw = r.children;
  if (!Array.isArray(childrenRaw)) childrenRaw = [];
  const children = (childrenRaw as unknown[])
    .map(mapOneServiceNode)
    .filter((x): x is ServiceTreeNode => x != null);

  return {
    id,
    name,
    parent_service_id: parentServiceId,
    estimated_wait_minutes: wait,
    children,
  };
}

export function mapServicesTree(data: unknown): ServiceTreeNode[] {
  if (!isObj(data)) return [];
  const arr = data.services;
  if (!Array.isArray(arr)) return [];
  return arr.map(mapOneServiceNode).filter((x): x is ServiceTreeNode => x != null);
}

function formatTicketDate(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  } catch {
    return iso;
  }
}

/** generate-token: { success, ticket: { ... } } */
export function mapGenerateTokenResult(data: unknown): CreateTicketResult | null {
  if (!isObj(data) || data.success !== true) return null;
  const t = data.ticket;
  if (!isObj(t)) return null;
  const r = t as Record<string, unknown>;
  const ticketId = String(r.id ?? '');
  const ticketNumber = String(r.ticket_number ?? '');
  const createdRaw = String(r.created_at ?? '');
  if (!ticketId && !ticketNumber) return null;

  const branchName = typeof r.branch_name === 'string' ? r.branch_name : undefined;
  const serviceName = typeof r.service_name === 'string' ? r.service_name : undefined;

  return {
    ticketId: ticketId || ticketNumber,
    ticketNumber: ticketNumber || ticketId,
    ticketDate: createdRaw ? formatTicketDate(createdRaw) : formatTicketDate(new Date().toISOString()),
    branchName,
    serviceName,
  };
}
