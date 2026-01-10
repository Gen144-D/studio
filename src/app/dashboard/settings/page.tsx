import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center gap-2 text-center">
        <Settings className="h-12 w-12 text-muted-foreground" />
        <h3 className="text-2xl font-bold tracking-tight font-headline">Settings</h3>
        <p className="text-sm text-muted-foreground">
          This feature is coming soon.
        </p>
      </div>
    </div>
  );
}
