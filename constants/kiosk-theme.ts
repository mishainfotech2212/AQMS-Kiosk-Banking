/**
 * Banking Kiosk — design palette (match provided mockups)
 */
export const KioskColors = {
  navy: '#003366',
  navyText: '#001A33',
  mediumBlue: '#0088CC',
  completedBlue: '#0099FF',
  accentBlue: '#00ADEF',
  buttonGradientStart: '#7FB3D5',
  buttonGradientEnd: '#7E96B0',
  headerGradientLeft: '#0088CC',
  headerGradientRight: '#003366',
  paleBg: '#F0F8FF',
  white: '#FFFFFF',
  grey: '#888888',
  greyLine: '#CCCCCC',
  greyMuted: '#667085',
  border: '#DEE2E6',
  cardGrey: '#F1F3F5',
  lightBlueBg: '#E3F2FD',
  lightBlueSelect: '#E6F2FF',
  ticketBlue: '#00ADEF',
};

export const SERVICE_GROUPS = [
  {
    id: 'account',
    title: 'Account Services',
    icon: 'card' as const,
    items: ['Balance Inquiry', 'Account Statement'],
  },
  {
    id: 'cash',
    title: 'Cash Services',
    icon: 'wallet' as const,
    items: ['Cash Deposit', 'Cash Withdrawal'],
  },
  {
    id: 'other',
    title: 'Other Services',
    icon: 'document-text' as const,
    items: ['Cheque Services', 'Locker Inquiry'],
  },
] as const;

export const BRANCHES = [
  { id: 'main' as const, name: 'Main Branch' },
  { id: 'city' as const, name: 'City Branch' },
  { id: 'rural' as const, name: 'Rural Branch' },
];
