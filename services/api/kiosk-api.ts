import { BRANCHES, SERVICE_GROUPS } from '@/constants/kiosk-theme';
import { apiRequest } from '@/services/api/client';
import { API_PATHS, buildTicketStatusUrl, isLiveApiEnabled } from '@/services/api/config';
import {
  mapBranchesFromValidate,
  mapErrorMessage,
  mapGenerateTokenResult,
  mapOrganization,
  mapPriorityTypes,
  mapServicesTree,
  isSupabaseSuccess,
} from '@/services/api/mappers';
import type {
  ApiBranch,
  ApiPriorityType,
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
  const statusUrl = buildTicketStatusUrl(num);
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
    statusUrl,
    qrCodeUrl: statusUrl,
  };
}

export type ValidateKioskCodeResult = {
  ok: boolean;
  /** Stable reason for UI / i18n mapping */
  reason?: 'invalid_code' | 'no_branches' | 'api_key' | 'error';
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
      reason: 'api_key',
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
      reason: 'invalid_code',
      message: mapErrorMessage(data) ?? 'Invalid kiosk code',
      organization: null,
      branches: [],
    };
  }

  const branches = mapBranchesFromValidate(data);
  const organization = mapOrganization(data);

  // Backend omits branches with zero counters — empty list means nothing can be served.
  if (branches.length === 0) {
    return {
      ok: false,
      reason: 'no_branches',
      message: 'No branches with counters are available for this kiosk',
      organization,
      branches: [],
    };
  }

  return {
    ok: true,
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
 * Priority step — get-priority-types-by-branch
 * POST { "branch_id": "...", "service_id": "..." }
 * When service_id is set, only priorities mapped to counters that serve that service are returned.
 */
export async function apiGetPriorityTypesByBranch(
  branchId: string,
  serviceId?: string | null,
): Promise<ApiPriorityType[]> {
  if (!isLiveApiEnabled()) {
    // Offline demo: only show sample priorities when a service is selected.
    if (!serviceId) return [];
    return [
      {
        id: 'local-senior',
        name: 'Senior Citizen',
        code: 'SC',
        description: 'Priority service for senior citizens',
        icon: null,
        color: null,
        priority_level: 1,
      },
      {
        id: 'local-vip',
        name: 'VIP Customer',
        code: 'VIP',
        description: 'Priority access for VIP customers',
        icon: null,
        color: null,
        priority_level: 2,
      },
      {
        id: 'local-disabled',
        name: 'Person with Disability',
        code: 'PWD',
        description: 'Accessible support for customers with disabilities',
        icon: null,
        color: null,
        priority_level: 1,
      },
      {
        id: 'local-pregnant',
        name: 'Pregnant Women',
        code: 'PW',
        description: 'Priority assistance for pregnant customers',
        icon: null,
        color: null,
        priority_level: 1,
      },
    ];
  }

  const json: Record<string, string> = { branch_id: branchId };
  if (serviceId) json.service_id = serviceId;

  const data = await apiRequest<unknown>(API_PATHS.getPriorityTypesByBranch, {
    method: 'POST',
    json,
  });

  if (!isSupabaseSuccess(data)) {
    return [];
  }

  return mapPriorityTypes(data);
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
