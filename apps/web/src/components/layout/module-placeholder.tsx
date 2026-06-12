import { PlaceholderModulePage } from "@/components/layout/placeholder-module-page";

interface ModulePlaceholderProps {
  title: string;
  description?: string;
  parentLabel?: string;
  route?: string;
  [key: string]: unknown;
}

export function ModulePlaceholder({
  title,
  description,
  parentLabel,
  route,
}: ModulePlaceholderProps) {
  return (
    <PlaceholderModulePage
      title={title}
      description={description}
      parentLabel={parentLabel}
      route={route}
    />
  );
}