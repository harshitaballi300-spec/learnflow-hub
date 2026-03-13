interface ProgressBarProps {
  value: number;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

const ProgressBar = ({ value, size = 'md', showLabel = true }: ProgressBarProps) => {
  const height = size === 'sm' ? 'h-1.5' : 'h-2.5';

  return (
    <div className="flex items-center gap-3">
      <div className={`flex-1 overflow-hidden rounded-full bg-muted ${height}`}>
        <div
          className={`${height} rounded-full gradient-primary transition-all duration-500`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      {showLabel && (
        <span className="shrink-0 text-xs font-semibold text-muted-foreground">{Math.round(value)}%</span>
      )}
    </div>
  );
};

export default ProgressBar;
