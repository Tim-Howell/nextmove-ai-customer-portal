"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, CheckCircle, XCircle } from "lucide-react";
import { sendLoginLink } from "@/app/actions/invitations";

interface ContactInvitationStatusProps {
  contactId: string;
  email: string | null;
  portalAccessEnabled: boolean;
  hasUserId: boolean;
}

export function ContactInvitationStatus({
  contactId,
  email,
  portalAccessEnabled,
  hasUserId,
}: ContactInvitationStatusProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSendLoginLink() {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const result = await sendLoginLink(contactId);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }

    setIsLoading(false);
  }

  if (!portalAccessEnabled) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <XCircle className="h-4 w-4" />
        Disabled
      </div>
    );
  }

  if (!email) {
    return (
      <div className="text-sm text-muted-foreground">
        Add email for portal access
      </div>
    );
  }

  if (!hasUserId) {
    return (
      <div className="text-sm text-muted-foreground">
        Account pending...
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Badge variant="default" className="bg-green-600">
          <CheckCircle className="h-3 w-3 mr-1" />
          Enabled
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSendLoginLink}
          disabled={isLoading}
          title="Send login link"
        >
          <Mail className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      {success && (
        <p className="text-sm text-green-600">Login link sent!</p>
      )}
    </div>
  );
}
