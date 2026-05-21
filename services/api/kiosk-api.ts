import { BRANCHES, SERVICE_GROUPS } from '@/constants/kiosk-theme';
import { apiRequest } from '@/services/api/client';
import { API_PATHS, isLiveApiEnabled } from '@/services/api/config';
import {
  mapBranchesFromValidate,
  mapErrorMessage,
  mapGenerateTokenResult,
  mapOrganization,
  mapServicesTree,
  isSupabaseSuccess,
} from '@/services/api/mappers';
import type {
  ApiBranch,
  CreateTicketResult,
  GenerateTokenPayload,
  KioskOrganization,
  ServiceTreeNode,
} from '@/services/api/types';

function getFallbackBranches(): ApiBranch[] {
  return BRANCHES.map((b) => ({ id: b.id, name: b.name }));
}

/** Flatten first level + items as fake tree for offline */
function getFallbackServiceTree(): ServiceTreeNode[] {
  return SERVICE_GROUPS.map((g) => ({
    id: g.id,
    name: g.title,
    estimated_wait_minutes: 10,
    children: g.items.map((name, i) => ({
      id: `${g.id}-${i}`,
      name,
      estimated_wait_minutes: 10,
      children: [],
    })),
  }));
}

function randomLocalTicket(): CreateTicketResult {
  const num = `TKT${String(Math.floor(100000 + Math.random() * 900000))}`;
  return {
    ticketId: num,
    ticketNumber: num,
    ticketDate: new Date().toLocaleString('en-IN', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }),
  };
}

export type ValidateKioskCodeResult = {
  ok: boolean;
  message?: string;
  organization: KioskOrganization | null;
  branches: ApiBranch[];
};

/**
 * Step 1 — validate-kiosk-code
 * POST { "kiosk_code": "ABCD12" }
 */
export async function apiValidateKioskCode(kioskCode: string): Promise<ValidateKioskCodeResult> {
  const code = kioskCode.trim();
  if (!isLiveApiEnabled()) {
    return {
      ok: false,
      message: 'API key not configured',
      organization: null,
      branches: [],
    };
  }

  const data = await apiRequest<unknown>(API_PATHS.validateKioskCode, {
    method: 'POST',
    json: { kiosk_code: code },
  });

  if (!isSupabaseSuccess(data)) {
    return {
      ok: false,
      message: mapErrorMessage(data) ?? 'Invalid kiosk code',
      organization: null,
      branches: [],
    };
  }

  const branches = mapBranchesFromValidate(data);
  const organization = mapOrganization(data);

  return {
    ok: branches.length > 0,
    message: branches.length === 0 ? 'No branches for this kiosk' : undefined,
    organization,
    branches,
  };
}

/**
 * Step 4 — get-services-by-branch
 * POST { "branch_id": "..." }
 */
export async function apiGetServicesByBranch(branchId: string): Promise<ServiceTreeNode[]> {
  if (!isLiveApiEnabled()) {
    return getFallbackServiceTree();
  }

  const data = await apiRequest<unknown>(API_PATHS.getServicesByBranch, {
    method: 'POST',
    json: { branch_id: branchId },
  });

  if (!isSupabaseSuccess(data)) {
    return [];
  }

  const tree = mapServicesTree(data);
  return tree.length > 0 ? tree : [];
}

/**
 * Step 6 — generate-token
 */
export async function apiGenerateToken(payload: GenerateTokenPayload): Promise<CreateTicketResult> {
  if (!isLiveApiEnabled()) {
    return randomLocalTicket();
  }

  const data = await apiRequest<unknown>(API_PATHS.generateToken, {
    method: 'POST',
    json: payload,
  });

  const mapped = mapGenerateTokenResult(data);
  if (mapped) return mapped;

  throw new Error(mapErrorMessage(data) ?? 'Failed to create ticket');
}

export { getFallbackBranches };
