// Icon facade. Pages import from this file so the underlying library can
// change without touching call sites. Two sources:
//
// 1. iconsax-react — 1,000 icons × 6 visual variants (Linear / Outline /
//    TwoTone / Bulk / Broken / Bold). Tree-shaken via named imports.
// 2. Fallback SVGs at the bottom — a few editorial glyphs we hand-rolled
//    because they read better at small sizes than the iconsax versions
//    (the closed-quote mark used in the "Why it matters" pull quote, and
//    the receipt scan icon).
//
// Usage:
//   import { Camera, Search, Quote } from "./icons";
//   <Camera className="size-4" />
//
// The iconsax <Icon /> component accepts `variant="Linear"` (default) plus
// a `size` and `color`. We pin variant to "Linear" via a wrapper so the
// rest of the app stays consistent — a uniform hairline stroke is the
// brand.

import type { SVGProps } from "react";
import {
  Camera as CameraRaw,
  DocumentText as DocumentTextRaw,
  Home as HomeRaw,
  Setting2 as Setting2Raw,
  Logout as LogoutRaw,
  Add as AddRaw,
  Trash as TrashRaw,
  Edit as EditRaw,
  CloseCircle as CloseCircleRaw,
  Gallery as GalleryRaw,
  Image as ImageRaw,
  InfoCircle as InfoCircleRaw,
  TickCircle as TickCircleRaw,
  Warning2 as Warning2Raw,
  Calendar as CalendarRaw,
  Tag as TagRaw,
  Eye as EyeRaw,
  EyeSlash as EyeSlashRaw,
  Lock as LockRaw,
  Sms as SmsRaw,
  Google as GoogleRaw,
  ArrowSquareRight as ArrowSquareRightRaw,
  ArrowDown2 as ArrowDown2Raw,
  ArrowUp2 as ArrowUp2Raw,
  ProfileCircle as ProfileCircleRaw,
  User as UserRaw,
  Crown as CrownRaw,
  Star as StarRaw,
  HambergerMenu as HambergerMenuRaw,
  Refresh2 as RefreshRaw,
  ArrowLeft2 as ArrowLeftRaw,
  ArrowRight2 as ArrowRightRaw,
  SearchNormal1 as SearchRaw,
  FilterSquare as FilterRaw,
  NotificationBing as BellRaw,
  DirectInbox as DownloadRaw,
  Profile2User as UsersRaw,
  TickSquare as CheckRaw,
  DocumentUpload as UploadRaw,
} from "iconsax-react";

// Wrapper that pins variant to Linear so call sites don't repeat it.
// The iconsax-react component is typed with a string-literal union for
// variant, so we type I as a generic keyed on the underlying component
// to keep call-site inference happy.
type IconProps = SVGProps<SVGSVGElement> & { size?: number | string };

function I<P extends { variant?: string; size?: number | string }>(
  Comp: React.ComponentType<P>,
) {
  return function Icon({ size = 16, ...rest }: IconProps) {
    // iconsax wants variant as a literal union, but we always pass "Linear".
    const Pinned = Comp as unknown as React.ComponentType<P & { variant: string; size: number | string }>;
    return <Pinned variant="Linear" size={size} {...(rest as unknown as P)} />;
  };
}

export const Camera = I(CameraRaw);
export const DocumentText = I(DocumentTextRaw);
export const Home = I(HomeRaw);
export const Setting = I(Setting2Raw);
export const Logout = I(LogoutRaw);
export const Plus = I(AddRaw);
export const Trash = I(TrashRaw);
export const Edit = I(EditRaw);
export const Close = I(CloseCircleRaw);
export const Gallery = I(GalleryRaw);
export const ImageIcon = I(ImageRaw);
export const Info = I(InfoCircleRaw);
export const Check = I(TickCircleRaw);
export const Warning = I(Warning2Raw);
export const Calendar = I(CalendarRaw);
export const Tag = I(TagRaw);
export const Eye = I(EyeRaw);
export const EyeOff = I(EyeSlashRaw);
export const Lock = I(LockRaw);
export const Sms = I(SmsRaw);
export const Google = I(GoogleRaw);
export const ExternalLink = I(ArrowSquareRightRaw);
export const ChevronDown = I(ArrowDown2Raw);
export const ChevronUp = I(ArrowUp2Raw);
export const Profile = I(ProfileCircleRaw);
export const User = I(UserRaw);
export const Users = I(UsersRaw);
export const Crown = I(CrownRaw);
export const Star = I(StarRaw);
export const Menu = I(HambergerMenuRaw);
export const Refresh = I(RefreshRaw);
export const ArrowLeft = I(ArrowLeftRaw);
export const ArrowRight = I(ArrowRightRaw);
export const Search = I(SearchRaw);
export const Filter = I(FilterRaw);
export const Bell = I(BellRaw);
export const Download = I(DownloadRaw);
export const CheckSquare = I(CheckRaw);
export const People = I(UsersRaw);
export const Upload = I(UploadRaw);
export const ArrowSquareRight = I(ArrowSquareRightRaw);

// ─── Hand-rolled fallbacks ─────────────────────────────────────────────────
// A few editorial glyphs we keep custom because iconsax's versions are too
// detailed or visually heavy for the small sizes we use them at (eyebrow
// labels, pull quotes).

export function Quote(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M7.17 6C4.32 6 2 8.32 2 11.17c0 2.49 1.79 4.58 4.17 4.97-.07.78-.43 1.55-.97 2.09-.41.41.13 1.06.59.86C9.13 18.45 11 16.39 11 13.83V11c0-2.76-2.24-5-5-5h.17ZM17.17 6c-2.85 0-5.17 2.32-5.17 5.17 0 2.49 1.79 4.58 4.17 4.97-.07.78-.43 1.55-.97 2.09-.41.41.13 1.06.59.86 3.34-.64 5.21-2.7 5.21-5.26V11c0-2.76-2.24-5-5-5h.17Z" />
    </svg>
  );
}

// Scan-text glyph — used in the extraction mock. The iconsax Scan icon is
// barcode-flavored; we want the "OCR over a receipt" feel.
export function ScanText(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M3 7V5a2 2 0 0 1 2-2h2M3 17v2a2 2 0 0 0 2 2h2M21 7V5a2 2 0 0 0-2-2h-2M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 12h10" />
    </svg>
  );
}
