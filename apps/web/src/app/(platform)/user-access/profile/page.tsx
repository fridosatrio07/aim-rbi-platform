"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, MouseEvent as ReactMouseEvent, ReactNode } from "react";
import { SignaturePad } from "./_components/signature-pad";
import {
  Bell,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FileCheck2,
  History,
  LineChart,
  LockKeyhole,
  Mail,
  MapPin,
  Pencil,
  Save,
  ShieldCheck,
  Upload,
  Workflow,
  X,
} from "lucide-react";

import type {
  NotificationItem,
  PreferredLanguage,
  ProfileForm,
  ProfileTab,
  Tone,
  ToneStyle,
} from "./_types/profile.types";
import {
  cx,
  getInitials,
  getTitleOptions,
  normalizeTitleForLanguage,
} from "./_utils/profile-utils";
import {
  accessScopeItems,
  activityLog,
  approvalAuthority,
  modulePermissions,
  notificationInitial,
  profileInitial,
  projectAccessGroups,
} from "./_data/profile.mock";
const toneStyles: Record<Tone, ToneStyle> = {
  blue: {
    badge:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-300",
    iconBox:
      "border-blue-200 bg-blue-50 dark:border-blue-500/30 dark:bg-blue-500/10",
    icon: "text-blue-700 dark:text-blue-300",
  },
  green: {
    badge:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300",
    iconBox:
      "border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10",
    icon: "text-emerald-700 dark:text-emerald-300",
  },
  cyan: {
    badge:
      "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-300",
    iconBox:
      "border-cyan-200 bg-cyan-50 dark:border-cyan-500/30 dark:bg-cyan-500/10",
    icon: "text-cyan-700 dark:text-cyan-300",
  },
  amber: {
    badge:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300",
    iconBox:
      "border-amber-200 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10",
    icon: "text-amber-700 dark:text-amber-300",
  },
  red: {
    badge:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300",
    iconBox:
      "border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10",
    icon: "text-red-700 dark:text-red-300",
  },
  purple: {
    badge:
      "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/40 dark:bg-violet-500/10 dark:text-violet-300",
    iconBox:
      "border-violet-200 bg-violet-50 dark:border-violet-500/30 dark:bg-violet-500/10",
    icon: "text-violet-700 dark:text-violet-300",
  },
  slate: {
    badge:
      "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200",
    iconBox:
      "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800",
    icon: "text-slate-700 dark:text-slate-200",
  },
};

function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/95",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Badge({
  children,
  tone = "slate",
}: {
  children: ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        toneStyles[tone].badge,
      )}
    >
      {children}
    </span>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950/60">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
        {label}
      </p>
      <p className="mt-0.5 text-xs font-semibold text-slate-950 dark:text-slate-100">{value}</p>
    </div>
  );
}

function SectionIcon({
  icon: Icon,
  tone,
}: {
  icon: typeof ShieldCheck;
  tone: Tone;
}) {
  return (
    <div
      className={cx(
        "grid h-9 w-9 shrink-0 place-items-center rounded-xl border",
        toneStyles[tone].iconBox,
      )}
    >
      <Icon className={cx("h-4 w-4", toneStyles[tone].icon)} />
    </div>
  );
}

function EditProfileModal({
  open,
  draft,
  setDraft,
  similarToFullName,
  setSimilarToFullName,
  signatureData,
  setSignatureData,
  onClose,
  onSave,
}: {
  open: boolean;
  draft: ProfileForm;
  setDraft: (next: ProfileForm) => void;
  similarToFullName: boolean;
  setSimilarToFullName: (next: boolean) => void;
  signatureData: string | null;
  setSignatureData: (value: string | null) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const [step, setStep] = useState<"identity" | "signature" | "review">("identity");

  if (!open) return null;

  const titleOptions = getTitleOptions(draft.preferredLanguage);

  const steps = [
    {
      id: "identity" as const,
      label: "Identity",
      description: "Core account profile",
    },
    {
      id: "signature" as const,
      label: "Digital Signature",
      description: "Signature on file",
    },
    {
      id: "review" as const,
      label: "Review",
      description: "Confirm changes",
    },
  ];

  const activeIndex = steps.findIndex((item) => item.id === step);
  const isFirstStep = activeIndex === 0;
  const isLastStep = activeIndex === steps.length - 1;

  function goNext(event?: ReactMouseEvent<HTMLButtonElement>) {
    event?.preventDefault();
    event?.stopPropagation();

    if (isLastStep) return;

    const nextStep = steps[Math.min(activeIndex + 1, steps.length - 1)];
    setStep(nextStep.id);
  }

  function goBack(event?: ReactMouseEvent<HTMLButtonElement>) {
    event?.preventDefault();
    event?.stopPropagation();

    if (isFirstStep) return;

    const previousStep = steps[Math.max(activeIndex - 1, 0)];
    setStep(previousStep.id);
  }

  function closeModal() {
    setStep("identity");
    onClose();
  }

  function saveChanges() {
    setStep("identity");
    onSave();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeModal();
        }
      }}
    >
      <div
        className="flex max-h-[92vh] w-[94vw] max-w-[1320px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        onMouseDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-black text-slate-950 dark:text-slate-100">Edit Profile</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Update profile identity, display preference, and digital signature status.
            </p>
          </div>

          <button
            type="button"
            onClick={closeModal}
            className="grid h-9 w-9 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            aria-label="Close Edit Profile"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="shrink-0 border-b border-slate-200 bg-slate-50/70 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-950/40">
          <div className="grid gap-2.5 md:grid-cols-3">
            {steps.map((item, index) => {
              const selected = item.id === step;
              const completed = index < activeIndex;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStep(item.id)}
                  className={cx(
                    "flex items-center gap-2.5 rounded-2xl border px-3 py-2 text-left transition",
                    selected
                      ? "border-blue-200 bg-white shadow-sm dark:border-blue-500/40 dark:bg-slate-900"
                      : "border-transparent bg-transparent hover:bg-white dark:hover:bg-slate-900",
                  )}
                >
                  <span
                    className={cx(
                      "grid h-8 w-8 shrink-0 place-items-center rounded-xl border text-xs font-black",
                      selected
                        ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-300"
                        : completed
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300"
                          : "border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400",
                    )}
                  >
                    {completed ? <Check className="h-4 w-4" /> : index + 1}
                  </span>

                  <span className="min-w-0">
                    <span className="block text-xs font-black text-slate-950 dark:text-slate-100">
                      {item.label}
                    </span>
                    <span className="block truncate text-[11px] text-slate-500 dark:text-slate-400">
                      {item.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();

            if (!isLastStep) {
              goNext();
              return;
            }

            saveChanges();
          }}
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
            {step === "identity" ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-950/50">
                <div className="mb-2.5">
                  <p className="text-sm font-black text-slate-950 dark:text-slate-100">
                    Identity Details
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-4">
                  <label className="space-y-1">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">TITLE</span>
                    <select
                      value={draft.title}
                      onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                      className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                    >
                      {titleOptions.map((title) => (
                        <option key={title}>{title}</option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-1">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">FULL NAME</span>
                    <input
                      value={draft.fullName}
                      onChange={(event) => {
                        const fullName = event.target.value;
                        setDraft({
                          ...draft,
                          fullName,
                          displayName: similarToFullName ? fullName : draft.displayName,
                        });
                      }}
                      className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                    />
                  </label>

                  <label className="space-y-1">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">EMAIL</span>
                    <input
                      type="email"
                      value={draft.email}
                      onChange={(event) => setDraft({ ...draft, email: event.target.value })}
                      className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 pr-9 text-xs font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                    />
                  </label>

                  <label className="space-y-1">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">ROLE</span>
                    <select
                      value={draft.role}
                      onChange={(event) => setDraft({ ...draft, role: event.target.value })}
                      className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                    >
                      <option>Asset Owner</option>
                      <option>RBI Engineer</option>
                      <option>Inspection Engineer</option>
                      <option>Integrity Engineer</option>
                      <option>Technical Reviewer</option>
                      <option>Superadmin</option>
                    </select>
                  </label>

                  <div className="space-y-1.5">
                    <label className="space-y-1">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">DISPLAY NAME</span>
                      <input
                        value={draft.displayName}
                        disabled={similarToFullName}
                        onChange={(event) => setDraft({ ...draft, displayName: event.target.value })}
                        className={cx(
                          "h-9 w-full rounded-xl border border-slate-200 px-3 text-xs font-semibold outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:focus:border-blue-500 dark:focus:ring-blue-500/20",
                          similarToFullName
                            ? "cursor-not-allowed bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                            : "bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100",
                        )}
                      />
                    </label>

                    <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={similarToFullName}
                        onChange={(event) => {
                          const checked = event.target.checked;
                          setSimilarToFullName(checked);
                          setDraft({
                            ...draft,
                            displayName: checked ? draft.fullName : draft.displayName,
                          });
                        }}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      Similar to Full Name
                    </label>
                  </div>

                  <label className="space-y-1">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">COMPANY</span>
                    <input
                      value={draft.company}
                      onChange={(event) => setDraft({ ...draft, company: event.target.value })}
                      className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                    />
                  </label>

                  <label className="space-y-1">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">PREFERRED LANGUAGE</span>
                    <select
                      value={draft.preferredLanguage}
                      onChange={(event) => {
                        const preferredLanguage = event.target.value as PreferredLanguage;
                        setDraft({
                          ...draft,
                          preferredLanguage,
                          title: normalizeTitleForLanguage(draft.title, preferredLanguage),
                        });
                      }}
                      className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                    >
                      <option>Bahasa Indonesia / English</option>
                      <option>Bahasa Indonesia</option>
                      <option>English</option>
                    </select>
                  </label>

                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">SIGNATURE ON FILE</span>
                    <div
                      className={cx(
                        "flex h-9 items-center rounded-xl border px-3 text-xs font-bold",
                        signatureData
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300"
                          : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300",
                      )}
                    >
                      {signatureData ? "Available" : "Pending"}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {step === "signature" ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-950/50">
                <SignaturePad value={signatureData} onChange={setSignatureData} />
              </div>
            ) : null}

            {step === "review" ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-950/50">
                  <p className="text-sm font-black text-slate-950 dark:text-slate-100">
                    Review Changes
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Confirm the profile data before saving changes.
                  </p>

                  <div className="mt-3 grid gap-2.5 md:grid-cols-2 xl:grid-cols-4">
                    <ProfileField label="TITLE" value={draft.title} />
                    <ProfileField label="FULL NAME" value={draft.fullName} />
                    <ProfileField label="DISPLAY NAME" value={similarToFullName ? draft.fullName : draft.displayName} />
                    <ProfileField label="EMAIL" value={draft.email} />
                    <ProfileField label="ROLE" value={draft.role} />
                    <ProfileField label="COMPANY" value={draft.company} />
                    <ProfileField label="PREFERRED LANGUAGE" value={draft.preferredLanguage} />
                    <ProfileField label="SIGNATURE ON FILE" value={signatureData ? "Available" : "Pending"} />
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex shrink-0 flex-wrap items-center justify-between gap-2.5 border-t border-slate-200 bg-white px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
            <button
              type="button"
              onClick={closeModal}
              className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancel Changes
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isFirstStep}
                onClick={(event) => goBack(event)}
                className={cx(
                  "h-9 rounded-xl border px-3 text-xs font-bold transition",
                  isFirstStep
                    ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-600"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
                )}
              >
                Back
              </button>

              {isLastStep ? (
                <button
                  type="submit"
                  className="inline-flex h-9 items-center gap-2 rounded-xl bg-blue-700 px-3 text-xs font-bold text-white transition hover:bg-blue-800"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(event) => goNext(event)}
                  className="h-9 rounded-xl bg-blue-700 px-3 text-xs font-bold text-white transition hover:bg-blue-800"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("access");
  const [profile, setProfile] = useState<ProfileForm>(profileInitial);
  const [draft, setDraft] = useState<ProfileForm>(profileInitial);
  const [editOpen, setEditOpen] = useState(false);
  const [similarToFullName, setSimilarToFullName] = useState(true);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoMenuOpen, setPhotoMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(notificationInitial);
  const [openProjectKeys, setOpenProjectKeys] = useState<string[]>(["spm01"]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const photoMenuRef = useRef<HTMLDivElement | null>(null);

  const initials = useMemo(() => getInitials(profile.displayName), [profile.displayName]);
  const activeModules = modulePermissions.filter((item) => item.enabled);
  const enabledScopes = accessScopeItems.filter((item) => item.enabled);

  useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl);
    };
  }, [photoUrl]);

  useEffect(() => {
    if (!photoMenuOpen) return;

    function handlePhotoMenuOutsideClick(event: MouseEvent) {
      const target = event.target as Node | null;
      if (!target) return;
      if (photoMenuRef.current?.contains(target)) return;
      setPhotoMenuOpen(false);
    }

    document.addEventListener("mousedown", handlePhotoMenuOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handlePhotoMenuOutsideClick);
    };
  }, [photoMenuOpen]);

  useEffect(() => {
    const restored: Array<{ element: HTMLElement; display: string }> = [];

    function hideProfileFooter() {
      const candidates = Array.from(
        document.querySelectorAll<HTMLElement>("footer, [class*='footer'], [id*='footer']")
      );

      candidates.forEach((element) => {
        const text = (element.textContent ?? "").trim();
        if (text.includes("About SUCOFINDO") || text.includes("All Rights Reserved")) {
          restored.push({
            element,
            display: element.style.display,
          });
          element.style.display = "none";
        }
      });
    }

    const timer = window.setTimeout(hideProfileFooter, 150);

    return () => {
      window.clearTimeout(timer);
      restored.forEach(({ element, display }) => {
        element.style.display = display;
      });
    };
  }, []);

  function openEditProfile() {
    setDraft(profile);
    setSimilarToFullName(profile.displayName === profile.fullName);
    setEditOpen(true);
  }

  function saveProfile() {
    const nextProfile: ProfileForm = {
      ...draft,
      title: normalizeTitleForLanguage(draft.title, draft.preferredLanguage),
      displayName: similarToFullName ? draft.fullName : draft.displayName,
    };

    setProfile(nextProfile);
    setEditOpen(false);
  }

  function onPhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (photoUrl) URL.revokeObjectURL(photoUrl);

    setPhotoUrl(URL.createObjectURL(file));
    setPhotoMenuOpen(false);
  }

  function removePhoto() {
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(null);
    setPhotoMenuOpen(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function toggleProjectAccordion(projectKey: string) {
    setOpenProjectKeys((current) =>
      current.includes(projectKey)
        ? current.filter((key) => key !== projectKey)
        : [...current, projectKey],
    );
  }

  function toggleNotification(id: string) {
    setNotifications((current) =>
      current.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item)),
    );
  }

  return (
    <section className="min-h-full bg-slate-50 px-3 py-3 text-slate-950 dark:bg-[#0b1020] dark:text-slate-50 sm:px-4 lg:px-5">
      <div className="mx-auto max-w-[1700px] space-y-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
            <span>User & Access</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-blue-700 dark:text-blue-300">Profile</span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-slate-100">
            Profile
          </h1>
        </div>

        <Card className="overflow-visible p-3">
          <div className="grid gap-3 xl:grid-cols-[220px_minmax(0,1fr)]">
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-3 text-center dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
              <div ref={photoMenuRef} className="relative mx-auto h-28 w-28">
                {photoUrl ? (
                  <div
                    aria-label={profile.displayName}
                    className="h-28 w-28 rounded-full border-[3px] border-blue-100 bg-cover bg-center shadow-sm ring-4 ring-blue-50 dark:border-blue-500/30 dark:ring-blue-500/10"
                    style={{ backgroundImage: `url("${photoUrl}")` }}
                  />
                ) : (
                  <div className="grid h-28 w-28 place-items-center rounded-full border-[3px] border-blue-100 bg-gradient-to-br from-blue-800 to-cyan-600 text-4xl font-black text-white shadow-sm ring-4 ring-blue-50 dark:border-blue-500/30 dark:ring-blue-500/10">
                    {initials}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setPhotoMenuOpen((current) => !current)}
                  className="absolute bottom-1 right-0 grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-blue-700 text-white shadow-lg transition hover:bg-blue-800 dark:border-slate-900"
                  title="Profile photo actions"
                >
                  <Camera className="h-4 w-4" />
                </button>

                {photoMenuOpen ? (
                  <div className="absolute left-1/2 top-full z-30 mt-2 w-48 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-1.5 text-left shadow-xl dark:border-slate-700 dark:bg-slate-900">
                    <button
                      type="button"
                      onClick={() => {
                        fileInputRef.current?.click();
                        setPhotoMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-blue-300"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Photo
                    </button>

                    <button
                      type="button"
                      disabled={!photoUrl}
                      onClick={removePhoto}
                      className={cx(
                        "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition",
                        photoUrl
                          ? "text-slate-700 hover:bg-red-50 hover:text-red-700 dark:text-slate-200 dark:hover:bg-red-500/10 dark:hover:text-red-300"
                          : "cursor-not-allowed text-slate-300 dark:text-slate-600",
                      )}
                    >
                      <X className="h-4 w-4" />
                      Remove Photo
                    </button>
                  </div>
                ) : null}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onPhotoChange}
              />

              <div className="mt-3">
                <p className="text-lg font-black text-slate-950 dark:text-slate-100">{profile.displayName}</p>
                <p className="mt-0.5 text-xs font-bold text-blue-700 dark:text-blue-300">{profile.role}</p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{profile.email}</p>
              </div>

              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                <Badge tone="green">Active</Badge>
                <Badge tone="blue">MFA Enabled</Badge>
                <Badge tone="cyan">Verified Email</Badge>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                    Profile Workspace
                  </p>
                  <h2 className="mt-0.5 text-xl font-black tracking-tight text-slate-950 dark:text-slate-100">
                    {profile.displayName}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={openEditProfile}
                  className="inline-flex h-9 items-center gap-2 rounded-xl border border-blue-200 bg-white px-3 text-xs font-bold text-blue-700 transition hover:bg-blue-50 dark:border-blue-500/30 dark:bg-slate-900 dark:text-blue-300 dark:hover:bg-slate-800"
                >
                  <Pencil className="h-4 w-4" />
                  Edit Profile
                </button>
              </div>

              <div className="grid gap-2.5 md:grid-cols-2 2xl:grid-cols-4">
                <ProfileField label="TITLE" value={profile.title} />
                <ProfileField label="FULL NAME" value={profile.fullName} />
                <ProfileField label="DISPLAY NAME" value={profile.displayName} />
                <ProfileField label="EMAIL" value={profile.email} />
                <ProfileField label="ROLE" value={profile.role} />
                <ProfileField label="COMPANY" value={profile.company} />
                <ProfileField label="PREFERRED LANGUAGE" value={profile.preferredLanguage} />
                <ProfileField label="SIGNATURE ON FILE" value={signatureData ? "Available" : "Pending"} />
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-3 xl:grid-cols-[1fr_1fr_1.15fr]">
          <Card className="p-3">
            <div className="flex items-center gap-2.5">
              <SectionIcon icon={MapPin} tone="blue" />
              <p className="text-sm font-black text-slate-950 dark:text-slate-100">Project Access</p>
            </div>

            <div className="mt-3 space-y-2">
              {projectAccessGroups.map((project) => {
                const isOpen = openProjectKeys.includes(project.key);
                const projectScopes = enabledScopes.filter((scope) => scope.projectKey === project.key);

                return (
                  <div
                    key={project.key}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/40"
                  >
                    <button
                      type="button"
                      onClick={() => toggleProjectAccordion(project.key)}
                      className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-slate-950 dark:text-slate-100">
                          {project.projectName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{project.description}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge tone={project.tone}>{project.accessLevel}</Badge>
                        <ChevronDown
                          className={cx(
                            "h-4 w-4 text-slate-500 transition-transform dark:text-slate-400",
                            isOpen ? "rotate-180" : "",
                          )}
                        />
                      </div>
                    </button>

                    {isOpen ? (
                      <div className="border-t border-slate-200 bg-slate-50/50 p-2.5 dark:border-slate-800 dark:bg-slate-900/40">
                        <div className="space-y-1.5">
                          {projectScopes.length > 0 ? (
                            projectScopes.map((scope) => (
                              <a
                                key={scope.id}
                                href={scope.route}
                                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 transition hover:border-blue-200 hover:bg-blue-50/40 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10"
                              >
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                                    {scope.entity}
                                  </p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">{scope.purpose}</p>
                                </div>
                                <Badge tone={scope.tone}>{scope.level}</Badge>
                              </a>
                            ))
                          ) : (
                            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-3 py-3 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                              No approved access scope for this project.
                            </div>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-3">
            <div className="flex items-center gap-2.5">
              <SectionIcon icon={Workflow} tone="green" />
              <p className="text-sm font-black text-slate-950 dark:text-slate-100">Approval Authority</p>
            </div>

            <div className="mt-3 space-y-1.5">
              {approvalAuthority.map((item) => (
                <div key={item} className="flex items-start gap-2 rounded-xl px-1 py-1.5">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 dark:bg-emerald-500/20">
                    <Check className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-300" />
                  </span>
                  <span className="text-xs font-medium leading-5 text-slate-700 dark:text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-3">
            <div className="flex items-center gap-2.5">
              <SectionIcon icon={ShieldCheck} tone="green" />
              <p className="text-sm font-black text-slate-950 dark:text-slate-100">Security Status</p>
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-[112px_minmax(0,1fr)]">
              <div className="mx-auto grid h-28 w-28 place-items-center rounded-2xl border border-emerald-100 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                <div className="grid h-20 w-20 place-items-center rounded-full border-[7px] border-emerald-500 bg-white shadow-sm dark:bg-slate-900">
                  <div className="text-center">
                    <p className="text-xl font-black text-slate-950 dark:text-slate-100">92%</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                      Score
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  ["Password Health", "Strong"],
                  ["Multi-factor Authentication", "Enabled"],
                  ["Session Alerts", "Enabled"],
                  ["Last Password Change", "01 Jun 2026"],
                  ["Access Review Cycle", "Quarterly"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-950/60"
                  >
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</span>
                    <span className="text-xs font-black text-slate-900 dark:text-slate-100">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <div className="border-b border-slate-200 px-3 pt-3 dark:border-slate-800">
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab("access")}
                className={cx(
                  "inline-flex h-9 items-center gap-2 rounded-t-2xl rounded-b-xl px-3 text-xs font-bold transition",
                  activeTab === "access"
                    ? "bg-blue-700 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                )}
              >
                <ShieldCheck className="h-4 w-4" />
                Access Scope
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("notifications")}
                className={cx(
                  "inline-flex h-9 items-center gap-2 rounded-t-2xl rounded-b-xl px-3 text-xs font-bold transition",
                  activeTab === "notifications"
                    ? "bg-blue-700 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                )}
              >
                <Bell className="h-4 w-4" />
                Notification Preferences
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("activity")}
                className={cx(
                  "inline-flex h-9 items-center gap-2 rounded-t-2xl rounded-b-xl px-3 text-xs font-bold transition",
                  activeTab === "activity"
                    ? "bg-blue-700 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                )}
              >
                <History className="h-4 w-4" />
                Activity Log
              </button>
            </div>
          </div>

          <div className="max-h-[min(420px,calc(100vh-38rem))] overflow-y-auto p-3 aim-shell-scrollbar">
            {activeTab === "access" ? (
  <div className="space-y-3">
    <div
      className="grid gap-2.5"
      style={{
        gridTemplateColumns:
          activeModules.length >= 8
            ? "repeat(3, minmax(0, 1fr))"
            : activeModules.length >= 4
              ? "repeat(2, minmax(0, 1fr))"
              : `repeat(${Math.max(activeModules.length, 1)}, minmax(0, 1fr))`,
      }}
    >
      {activeModules.map((item) => (
        <div
          key={item.label}
          className="min-h-[58px] rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/50"
        >
          <div className="flex h-full items-center justify-between gap-2.5">
            <span className="pr-2 text-xs font-black leading-snug text-slate-800 dark:text-slate-200">
              {item.label}
            </span>
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-300" />
          </div>
        </div>
      ))}
    </div>
  </div>
) : null}{activeTab === "notifications" ? (
              <div className="grid gap-3 md:grid-cols-2">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-black text-slate-950 dark:text-slate-100">{item.label}</p>
                        <p className="mt-1 text-xs leading-4 text-slate-500 dark:text-slate-400">{item.description}</p>
                      </div>

                      <button
                        type="button"
                        aria-pressed={item.enabled}
                        onClick={() => toggleNotification(item.id)}
                        className={cx(
                          "relative h-6 w-11 rounded-full transition",
                          item.enabled ? "bg-blue-700" : "bg-slate-300 dark:bg-slate-700",
                        )}
                      >
                        <span
                          className={cx(
                            "absolute top-1 h-4 w-4 rounded-full bg-white shadow transition",
                            item.enabled ? "left-6" : "left-1",
                          )}
                        />
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <Badge tone={item.enabled ? "green" : "slate"}>
                        {item.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                      <Badge tone="cyan">{item.channel}</Badge>
                      <Badge
                        tone={
                          item.priority === "Escalation"
                            ? "red"
                            : item.priority === "High"
                              ? "amber"
                              : "slate"
                        }
                      >
                        {item.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {activeTab === "activity" ? (
              <div className="space-y-2">
                {activityLog.map((item) => (
                  <a
                    key={`${item.title}-${item.timestamp}`}
                    href={item.route}
                    className="flex gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 transition hover:border-blue-200 hover:bg-blue-50/40 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10"
                  >
                    <div
                      className={cx(
                        "grid h-10 w-10 shrink-0 place-items-center rounded-2xl border",
                        toneStyles[item.tone].iconBox,
                      )}
                    >
                      {item.tone === "green" ? (
                        <LockKeyhole className={cx("h-4 w-4", toneStyles[item.tone].icon)} />
                      ) : null}
                      {item.tone === "blue" ? (
                        <LineChart className={cx("h-4 w-4", toneStyles[item.tone].icon)} />
                      ) : null}
                      {item.tone === "amber" ? (
                        <FileCheck2 className={cx("h-4 w-4", toneStyles[item.tone].icon)} />
                      ) : null}
                      {item.tone === "purple" ? (
                        <Bell className={cx("h-4 w-4", toneStyles[item.tone].icon)} />
                      ) : null}
                      {item.tone === "cyan" ? (
                        <Mail className={cx("h-4 w-4", toneStyles[item.tone].icon)} />
                      ) : null}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-black text-slate-950 dark:text-slate-100">{item.title}</p>
                      <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">{item.subtitle}</p>
                      <p className="mt-1.5 text-[11px] text-slate-400 dark:text-slate-500">{item.timestamp}</p>
                    </div>
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </Card>
      </div>

      <EditProfileModal
        open={editOpen}
        draft={draft}
        setDraft={setDraft}
        similarToFullName={similarToFullName}
        setSimilarToFullName={setSimilarToFullName}
        signatureData={signatureData}
        setSignatureData={setSignatureData}
        onClose={() => setEditOpen(false)}
        onSave={saveProfile}
      />
    </section>
  );
}
