"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, RefreshCw, CheckCircle, Clock, XCircle } from "lucide-react";
import { sendCustomerInvitation, resendCustomerInvitation } from "@/app/actions/invitations";
import type { InvitationStatus, CustomerInvitation } from "@/types/database";

interface ContactInvitationStatusProps {
  contactId: string;
  email: string | null;
  portalAccessEnabled: boolean;
  status: InvitationStatus;
  invitation: CustomerInvitation | null;
}

export function ContactInvitationStatus({
  contactId,
  email,
  portalAccessEnabled,
  status,
  invitation,
}: ContactInvitationStatusProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSendInvitation() {
    setIsLoading(true);
    setError(null);

    const result = await sendCustomerInvitation(contactId);

    if (result.error) {
      setError(result.error);
    }

    setIsLoading(false);
  }

  async function handleResendInvitation() {
    setIsLoading(true);
    setError(null);

    const result = await resendCustomerInvitation(contactId);

    if (result.error) {
      setError(result.error);
    }

    setIsLoading(false);
  }

  if (!portalAccessEnabled) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <XCircle className="h-4 w-4" />
        Portal access disabled
      </div>
    );
  }

  if (status === "active") {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="default" className="bg-green-600">
          <CheckCircle className="h-3 w-3 mr-1" />
          Portal Access Active
        </Badge>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Invitation Pending
          </Badge>
          <span className="text-xs text-muted-foreground">
            Sent {invitation ? new Date(invitation.invited_at).toLocaleDateString() : ""}
          </span>
        </div>
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={handleResendInvitation}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Resend Invitation
        </Button>
      </div>
    );
  }

  if (status === "expired") {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Invitation Expired
          </Badge>
        </div>
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={handleResendInvitation}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Resend Invitation
        </Button>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="text-sm text-muted-foreground">
        Add email to enable portal invitation
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        Not yet invited
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={handleSendInvitation}
        disabled={isLoading}
      >
        <Mail className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
        {isLoading ? "Sending..." : "Send Invitation"}
      </Button>
    </div>
  );
}
