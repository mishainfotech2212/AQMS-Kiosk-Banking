import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { BRANCHES } from '@/constants/kiosk-theme';
import type { ApiBranch, CreateTicketResult, KioskOrganization, ServiceTreeNode } from '@/services/api/types';

export type BranchId = string;
export type LangId = 'en' | 'hi';
export type PriorityTypeId = 'pregnant' | 'vip' | 'disabled' | 'senior' | null;

function randomTicket(): string {
  return `TKT${String(Math.floor(100000 + Math.random() * 900000))}`;
}

function formatTicketDate(d: Date): string {
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

type TicketType = 'standard' | 'priority' | null;

interface KioskContextValue {
  step: number;
  setStep: (n: number) => void;
  goNext: () => void;
  goBack: () => void;
  resetFlow: () => void;
  kioskId: string;
  setKioskId: (v: string) => void;
  organization: KioskOrganization | null;
  setOrganization: (o: KioskOrganization | null) => void;
  branch: BranchId | null;
  setBranch: (b: BranchId | null) => void;
  branchList: ApiBranch[];
  setBranchList: (list: ApiBranch[]) => void;
  language: LangId;
  setLanguage: (l: LangId) => void;
  serviceCategory: string | null;
  setServiceCategory: (v: string | null) => void;
  serviceName: string | null;
  setServiceName: (v: string | null) => void;
  serviceItemId: string | null;
  setServiceItemId: (id: string | null) => void;
  serviceTreeRoots: ServiceTreeNode[];
  setServiceTreeRoots: (t: ServiceTreeNode[]) => void;
  selectedServiceWaitMinutes: number | null;
  setSelectedServiceWaitMinutes: (n: number | null) => void;
  ticketType: TicketType;
  setTicketType: (t: TicketType) => void;
  priorityType: PriorityTypeId;
  setPriorityType: (t: PriorityTypeId) => void;
  customerName: string;
  setCustomerName: (v: string) => void;
  customerPhone: string;
  setCustomerPhone: (v: string) => void;
  ticketNumber: string;
  ticketDate: string;
  ticketRemoteId: string | null;
  qrCodeUrl: string | null;
  /** Step 7: names returned from generate-token (override display) */
  ticketDisplayBranchName: string | null;
  ticketDisplayServiceName: string | null;
  refreshTicketMeta: () => void;
  applyTicketFromServer: (r: CreateTicketResult) => void;
  branchLabel: string;
  summaryBranchLabel: string;
  summaryServiceLabel: string;
  waitTimeLabel: string;
  estimatedServiceTime: string;
}

const KioskContext = createContext<KioskContextValue | null>(null);

const INITIAL = {
  step: 1,
  kioskId: '',
  branch: null as BranchId | null,
  language: 'en' as LangId,
  serviceCategory: null as string | null,
  serviceName: null as string | null,
  serviceItemId: null as string | null,
  ticketType: null as TicketType,
  priorityType: null as PriorityTypeId,
  customerName: '',
  customerPhone: '',
};

export function KioskProvider({ children }: { children: React.ReactNode }) {
  const [step, setStepState] = useState(1);
  const [kioskId, setKioskId] = useState(INITIAL.kioskId);
  const [organization, setOrganization] = useState<KioskOrganization | null>(null);
  const [branch, setBranch] = useState<BranchId | null>(INITIAL.branch);
  const [branchList, setBranchList] = useState<ApiBranch[]>([]);
  const [language, setLanguage] = useState<LangId>(INITIAL.language);
  const [serviceCategory, setServiceCategory] = useState<string | null>(INITIAL.serviceCategory);
  const [serviceName, setServiceName] = useState<string | null>(INITIAL.serviceName);
  const [serviceItemId, setServiceItemId] = useState<string | null>(INITIAL.serviceItemId);
  const [serviceTreeRoots, setServiceTreeRoots] = useState<ServiceTreeNode[]>([]);
  const [selectedServiceWaitMinutes, setSelectedServiceWaitMinutes] = useState<number | null>(null);
  const [ticketType, setTicketType] = useState<TicketType>(INITIAL.ticketType);
  const [priorityType, setPriorityType] = useState<PriorityTypeId>(INITIAL.priorityType);
  const [customerName, setCustomerName] = useState(INITIAL.customerName);
  const [customerPhone, setCustomerPhone] = useState(INITIAL.customerPhone);
  const [ticketNumber, setTicketNumber] = useState(() => randomTicket());
  const [ticketDate, setTicketDate] = useState(() => formatTicketDate(new Date()));
  const [ticketRemoteId, setTicketRemoteId] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [ticketDisplayBranchName, setTicketDisplayBranchName] = useState<string | null>(null);
  const [ticketDisplayServiceName, setTicketDisplayServiceName] = useState<string | null>(null);
  const [waitOverride, setWaitOverride] = useState<string | null>(null);
  const [estOverride, setEstOverride] = useState<string | null>(null);

  const refreshTicketMeta = useCallback(() => {
    setTicketNumber(randomTicket());
    setTicketDate(formatTicketDate(new Date()));
    setTicketRemoteId(null);
    setQrCodeUrl(null);
    setWaitOverride(null);
    setEstOverride(null);
    setTicketDisplayBranchName(null);
    setTicketDisplayServiceName(null);
  }, []);

  const applyTicketFromServer = useCallback(
    (r: CreateTicketResult) => {
      setTicketRemoteId(r.ticketId);
      setTicketNumber(r.ticketNumber);
      setTicketDate(r.ticketDate);
      setQrCodeUrl(r.qrCodeUrl ?? null);
      if (r.branchName) setTicketDisplayBranchName(r.branchName);
      if (r.serviceName && !serviceName) setTicketDisplayServiceName(r.serviceName);
      if (r.waitTimeLabel) setWaitOverride(r.waitTimeLabel);
      if (r.estimatedServiceTime) setEstOverride(r.estimatedServiceTime);
    },
    [serviceName],
  );

  const resetFlow = useCallback(() => {
    setStepState(1);
    setKioskId(INITIAL.kioskId);
    setOrganization(null);
    setBranch(INITIAL.branch);
    setBranchList([]);
    setLanguage(INITIAL.language);
    setServiceCategory(INITIAL.serviceCategory);
    setServiceName(INITIAL.serviceName);
    setServiceItemId(INITIAL.serviceItemId);
    setServiceTreeRoots([]);
    setSelectedServiceWaitMinutes(null);
    setTicketType(INITIAL.ticketType);
    setPriorityType(INITIAL.priorityType);
    setCustomerName(INITIAL.customerName);
    setCustomerPhone(INITIAL.customerPhone);
    setTicketRemoteId(null);
    setQrCodeUrl(null);
    setTicketDisplayBranchName(null);
    setTicketDisplayServiceName(null);
    setWaitOverride(null);
    setEstOverride(null);
    setTicketNumber(randomTicket());
    setTicketDate(formatTicketDate(new Date()));
  }, []);

  const setStep = useCallback((n: number) => setStepState(n), []);

  const goNext = useCallback(() => setStepState((s) => Math.min(s + 1, 9)), []);
  const goBack = useCallback(() => setStepState((s) => Math.max(s - 1, 1)), []);

  const branchLabel = useMemo(() => {
    const fromApi = branchList.find((b) => b.id === branch)?.name;
    if (fromApi) return fromApi;
    return BRANCHES.find((b) => b.id === branch)?.name ?? '—';
  }, [branch, branchList]);

  const summaryBranchLabel = ticketDisplayBranchName ?? branchLabel;
  const summaryServiceLabel = ticketDisplayServiceName ?? (serviceName ?? '—');

  const waitTimeLabel = useMemo(() => {
    if (waitOverride) return waitOverride;
    if (ticketType === 'priority') return '~5-10 Minutes';
    return '~15-20 Minutes';
  }, [ticketType, waitOverride]);

  const estimatedServiceTime = useMemo(() => {
    if (estOverride) return estOverride;
    if (selectedServiceWaitMinutes != null && selectedServiceWaitMinutes > 0) {
      return `~${selectedServiceWaitMinutes} Minutes`;
    }
    if (ticketType === 'priority') return '~5-10 Minutes';
    return '~10 Minutes';
  }, [ticketType, estOverride, selectedServiceWaitMinutes]);

  const value = useMemo<KioskContextValue>(
    () => ({
      step,
      setStep,
      goNext,
      goBack,
      resetFlow,
      kioskId,
      setKioskId,
      organization,
      setOrganization,
      branch,
      setBranch,
      branchList,
      setBranchList,
      language,
      setLanguage,
      serviceCategory,
      setServiceCategory,
      serviceName,
      setServiceName,
      serviceItemId,
      setServiceItemId,
      serviceTreeRoots,
      setServiceTreeRoots,
      selectedServiceWaitMinutes,
      setSelectedServiceWaitMinutes,
      ticketType,
      setTicketType,
      priorityType,
      setPriorityType,
      customerName,
      setCustomerName,
      customerPhone,
      setCustomerPhone,
      ticketNumber,
      ticketDate,
      ticketRemoteId,
      qrCodeUrl,
      ticketDisplayBranchName,
      ticketDisplayServiceName,
      refreshTicketMeta,
      applyTicketFromServer,
      branchLabel,
      summaryBranchLabel,
      summaryServiceLabel,
      waitTimeLabel,
      estimatedServiceTime,
    }),
    [
      step,
      setStep,
      goNext,
      goBack,
      resetFlow,
      kioskId,
      organization,
      branch,
      branchList,
      language,
      serviceCategory,
      serviceName,
      serviceItemId,
      serviceTreeRoots,
      selectedServiceWaitMinutes,
      ticketType,
      priorityType,
      customerName,
      customerPhone,
      ticketNumber,
      ticketDate,
      ticketRemoteId,
      qrCodeUrl,
      ticketDisplayBranchName,
      ticketDisplayServiceName,
      refreshTicketMeta,
      applyTicketFromServer,
      branchLabel,
      summaryBranchLabel,
      summaryServiceLabel,
      waitTimeLabel,
      estimatedServiceTime,
    ],
  );

  return <KioskContext.Provider value={value}>{children}</KioskContext.Provider>;
}

export function useKiosk() {
  const ctx = useContext(KioskContext);
  if (!ctx) throw new Error('useKiosk must be used within KioskProvider');
  return ctx;
}
