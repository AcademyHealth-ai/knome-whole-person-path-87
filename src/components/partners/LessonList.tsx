import React from "react";
import { Card } from "@/components/ui/card";

type Lesson = {
  id: string;
  title: string;
  summary?: string | null;
};

interface Props {
  title: string;
  lessons: Lesson[];
  loading: boolean;
}

export const LessonList: React.FC<Props> = ({ title, lessons, loading }) => (
  <div className="lg:col-span-2 space-y-4">
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      {loading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : lessons.length === 0 ? (
        <p className="text-muted-foreground">No lessons to show.</p>
      ) : (
        <ol className="space-y-3 list-decimal pl-6">
          {lessons.map((l) => (
            <li key={l.id}>
              <article>
                <h3 className="font-medium">{l.title}</h3>
                {l.summary && <p className="text-sm text-muted-foreground">{l.summary}</p>}
              </article>
            </li>
          ))}
        </ol>
      )}
    </Card>
  </div>
);
