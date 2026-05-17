"use client";

import { Code, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { RawEvent } from "@/lib/translator/types";

interface RawDataDialogProps {
  event: RawEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function RawDataField({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}): React.JSX.Element {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
      <p
        className={`text-sm break-all rounded bg-muted px-3 py-2 ${mono ? "font-mono" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}

export function RawDataDialog({
  event,
  open,
  onOpenChange,
}: RawDataDialogProps): React.JSX.Element {
  if (!event) return <></>;

  const horizonUrl = `https://horizon-testnet.stellar.org/transactions/${event.txHash}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-muted-foreground" />
            Raw Event Data
          </DialogTitle>
          <DialogDescription>
            Hex-encoded XDR data as received from the Stellar network. This is what
            Open-Audit translates into human-readable text.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <RawDataField label="Event ID" value={event.id} mono />
          <RawDataField label="Contract ID" value={event.contractId} mono />
          <RawDataField label="Transaction Hash" value={event.txHash} mono />
          <RawDataField label="Ledger" value={event.ledger.toLocaleString()} />
          <RawDataField
            label="Timestamp"
            value={new Date(event.timestamp * 1000).toISOString()}
          />

          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Topics ({event.topics.length})
            </p>
            <div className="space-y-1">
              {event.topics.map(function (topic, index) {
                return (
                  <p
                    key={index}
                    className="text-sm break-all rounded bg-muted px-3 py-2 font-mono"
                  >
                    <span className="text-muted-foreground mr-2">[{index}]</span>
                    {topic}
                  </p>
                );
              })}
            </div>
          </div>

          <RawDataField label="Data" value={event.data} mono />

          <div className="pt-2 border-t">
            <Button variant="outline" size="sm" asChild>
              <a href={horizonUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Stellar Expert
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
