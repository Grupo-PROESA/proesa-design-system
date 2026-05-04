// Layout
export {
  Layout,
  Sidebar,
  Header,
  BrandMark,
  PortalChip,
  type NavItem,
  type NavSection,
  type Role,
} from "./components/layout";

// Auth
export {
  AuthProvider,
  useAuth,
  ProtectedRoute,
  LoginPage,
  type User,
} from "./components/auth";

// UI primitives
export {
  Button,
  Card,
  CardHeader,
  CardBody,
  Badge,
  Modal,
  ConfirmModal,
  ToastContainer,
  Spinner,
  HelpButton,
  HelpPopover,
  Field,
  INPUT_CLASS,
  type ButtonVariant,
  type ButtonSize,
  type BadgeVariant,
  type BadgeSize,
  type ModalSize,
} from "./components/ui";

// Data
export {
  KpiCard,
  ActionTile,
  MoneyCell,
  EstadoSistemaCard,
  FilterPills,
  DataTable,
  type KpiTone,
  type KpiFormat,
  type EstadoSistemaStatus,
  type Column,
} from "./components/data";

// Notifications (opt-in)
export {
  SyncStatus,
  PendientesPill,
  AlertPill,
  AlertaCard,
  AlertDrawer,
  type Alerta,
  type AlertSeveridad,
} from "./components/notifications";

// Domain (opt-in)
export {
  RiskBadge,
  AgingBar,
  type RiskCategory,
  type RiskBadgeSize,
  type AgingBucket,
} from "./components/domain";

// Hooks
export {
  ToastProvider,
  useToast,
  useLivePoll,
  useApi,
  type Toast,
  type ToastType,
} from "./hooks";

// Utils
export {
  formatDateMx,
  formatDateTimeMx,
  todayMxISO,
  formatRelative,
  formatMoneyMx,
  formatNumberMx,
  formatPercentMx,
  apiClient,
  ApiError,
} from "./utils";

// Pages / templates
export { DashboardTemplate } from "./pages";
