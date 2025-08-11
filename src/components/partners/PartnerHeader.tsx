import React from "react";
import { IOSButton } from "@/components/ios/IOSButton";

interface Props {
  displayName: string;
  tagline?: string | null;
  toolsUrl?: string | null;
  onBack: () => void;
}

export const PartnerHeader: React.FC<Props> = ({ displayName, tagline, toolsUrl, onBack }) => (
  <header className="mb-8">
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">{displayName}</h1>
        {tagline && <p className="text-muted-foreground mt-1">{tagline}</p>}
      </div>
      <div className="flex items-center gap-2">
        {toolsUrl && (
          <IOSButton asChild>
            <a href={toolsUrl} target="_blank" rel="noopener noreferrer">
              Visit Tools
            </a>
          </IOSButton>
        )}
        <IOSButton variant="outline" onClick={onBack}>
          Back Home
        </IOSButton>
      </div>
    </div>
  </header>
);
