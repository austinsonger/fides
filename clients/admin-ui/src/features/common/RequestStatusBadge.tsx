import { Badge, BadgeProps, Spinner } from "fidesui";

import { PrivacyRequestStatus } from "~/types/api";

export const statusPropMap: {
  [key in PrivacyRequestStatus]: BadgeProps & { label?: string };
} = {
  approved: {
    bg: "success.100",
    label: "Approved",
  },
  complete: {
    bg: "success.100",
    label: "Completed",
  },
  awaiting_email_send: {
    bg: "olive.100",
    label: "Awaiting Email Send",
  },
  denied: {
    bg: "error.100",
    label: "Denied",
  },
  canceled: {
    bg: "white.100",
    label: "Canceled",
  },
  error: {
    bg: "error.100",
    label: "Error",
  },
  in_processing: {
    bg: "nectar.100",
    label: "In Progress",
  },
  paused: {
    bg: "sandstone.100",
    label: "Paused",
  },
  pending: {
    bg: "alert.100",
    label: "New",
  },
  identity_unverified: {
    bg: "error.100",
    label: "Unverified",
  },
  requires_input: {
    bg: "warn.100",
    label: "Requires Input",
  },
};

interface RequestBadgeProps {
  status: keyof typeof statusPropMap;
}

const RequestStatusBadge = ({ status }: RequestBadgeProps) => (
  <Badge
    bg={statusPropMap[status].bg}
    width="100%"
    minWidth="120px"
    lineHeight="22px"
    textAlign="center"
    data-testid="request-status-badge"
  >
    <span
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {statusPropMap[status].label}
      {status === PrivacyRequestStatus.IN_PROCESSING && (
        <Spinner size="xs" color="white" ml={2} />
      )}
    </span>
  </Badge>
);

export default RequestStatusBadge;
