import { PlaceholderModulePage } from "@/components/layout/placeholder-module-page";

type ModulePlaceholderProps = {
  title: string;
  eyebrow?: string;
  parentLabel?: string;
  route?: string;
  description?: string;
  status?: string;
};

export function ModulePlaceholder({
  title,
  eyebrow,
  parentLabel,
  route,
}: ModulePlaceholderProps) {
  return (
    <PlaceholderModulePage
      title={title}
      parentLabel={parentLabel ?? eyebrow}
      route={route}
    />
  );
}