import { PlaceholderModulePage } from "@/components/layout/placeholder-module-page";

interface ModulePlaceholderProps {
  title: string;
  description?: string;
  parentLabel?: string;
  parentHref?: string;
  route?: string;
  status?: "Prepared" | "In Design" | "In Development" | "Prototype";
  dataSource?: string;
  compact?: boolean;
}

export function ModulePlaceholder({
  compact,
  dataSource,
  title,
  description,
  parentHref,
  parentLabel,
  route,
  status,
}: ModulePlaceholderProps) {
  return (
    <PlaceholderModulePage
      compact={compact}
      dataSource={dataSource}
      title={title}
      description={description}
      parentHref={parentHref}
      parentLabel={parentLabel}
      route={route}
      status={status}
    />
  );
}
