import React from "react";
import { IOSCard } from "@/components/ios/IOSCard";
import { Badge } from "@/components/ui/badge";

type Pack = {
  id: string;
  title: string;
  description?: string | null;
};

interface Props {
  packs: Pack[];
  activePackId: string | null;
  loading: boolean;
  onSelect: (id: string) => void;
}

export const PackList: React.FC<Props> = ({ packs, activePackId, loading, onSelect }) => (
  <div className="lg:col-span-1 space-y-4">
    <IOSCard>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">Content Packs</h2>
        {packs.length === 0 && !loading && (
          <p className="text-muted-foreground">No content available yet.</p>
        )}
        <ul className="space-y-2">
          {packs.map((p) => (
            <li key={p.id}>
              <button
                onClick={() => onSelect(p.id)}
                className={`w-full text-left rounded-md px-3 py-2 transition-colors ${
                  activePackId === p.id ? "bg-accent" : "hover:bg-accent"
                }`}
                aria-current={activePackId === p.id ? "true" : "false"}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{p.title}</span>
                  {activePackId === p.id && <Badge>Active</Badge>}
                </div>
                {p.description && (
                  <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </IOSCard>
  </div>
);
