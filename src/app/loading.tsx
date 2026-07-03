export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-film-border border-t-film-accent rounded-full animate-spin"></div>
        <p className="text-film-muted text-sm font-medium animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
