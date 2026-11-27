export type IndicatorItem = {
  value: string;
  label: string;
};

export type ClientLogoItem = {
  src: string;
  alt: string;
};

export type DirectorCardItem = {
  mediaType: "video" | "image";
  src: string;
  poster?: string;
  name: string;
  role: string;
  duration?: string;
};

export type HomeSolutionCardItem = {
  routePath: string;
  tag: string;
  category: string;
  title: string;
  desc: string;
  topics: string[];
  ctaText: string;
  image: string;
  imageAlt: string;
  objectPosition?: string;
};

export type CardListItem = {
  id: string;
  sourceIndex: number;
  texts: string[];
  image?: {
    src: string;
    alt: string;
    objectPosition?: string;
  };
};

export type InlineNavigationPrimaryId = "home" | "about" | "solutions" | "contact";
export type InlineNavigationGroupId = "engineering" | "inspection" | "projects";

export type InlineNavigationPrimaryItem = {
  id: InlineNavigationPrimaryId;
  label: string;
  href: string | null;
};

export type InlineNavigationServiceItem = {
  id: string;
  label: string;
  href: string;
};

export type InlineNavigationGroup = {
  id: InlineNavigationGroupId;
  title: string;
  description: string;
  services: InlineNavigationServiceItem[];
};

export type InlineNavigationContent = {
  primary: InlineNavigationPrimaryItem[];
  groups: InlineNavigationGroup[];
};

export type EditableTextField = {
  key: string;
  kind: "text";
  managedBy?: "navigation" | "global" | "ffs";
  selector: string;
  textNodeIndex: number;
  value: string;
  label: string;
  tag?: string;
  section?: string;
};

export type EditableRichTextField = {
  key: string;
  kind: "richText";
  selector: string;
  value: string;
  originalValue: string;
  label: string;
  tag: string;
  section?: string;
};

export type EditableImageField = {
  key: string;
  kind: "image";
  selector: string;
  value: string;
  originalValue: string;
  altText: string;
  objectPosition?: string;
  originalObjectPosition?: string;
  editorPhotoLocked?: boolean;
  label: string;
};

export type EditableLinkField = {
  key: string;
  kind: "link";
  selector: string;
  value: string;
  originalValue: string;
  label: string;
};

export type EditableBackgroundImageField = {
  key: string;
  kind: "backgroundImage";
  selector: string;
  value: string;
  originalValue: string;
  styleProperty: "background" | "background-image";
  styleValue: string;
  label: string;
};

export type EditableSectionOrderField = {
  key: string;
  kind: "sectionOrder";
  parentSelector: string;
  value: string[];
  items: Array<{ selector: string; label: string }>;
  label: string;
};

export type EditableIndicatorsField = {
  key: string;
  kind: "indicators";
  selector: string;
  value: IndicatorItem[];
  originalValue: IndicatorItem[];
  label: string;
};

export type EditableClientLogosField = {
  key: string;
  kind: "clientLogos";
  selector: string;
  value: ClientLogoItem[];
  originalValue: ClientLogoItem[];
  label: string;
};

export type EditableHomeSolutionsField = {
  key: string;
  kind: "homeSolutions";
  selector: string;
  value: HomeSolutionCardItem[];
  originalValue: HomeSolutionCardItem[];
  label: string;
};

export type EditableDirectorCardsField = {
  key: string;
  kind: "directorCards";
  selector: string;
  value: DirectorCardItem[];
  originalValue: DirectorCardItem[];
  label: string;
};

export type EditableCardListField = {
  key: string;
  kind: "cardList";
  selector: string;
  itemSelector: string;
  connectorSelector?: string;
  label: string;
  minItems: number;
  maxItems: number;
  originalCount: number;
  editorPhotoLocked?: boolean;
  value: CardListItem[];
  originalValue: CardListItem[];
};

export type EditablePageField =
  | EditableTextField
  | EditableRichTextField
  | EditableImageField
  | EditableLinkField
  | EditableBackgroundImageField
  | EditableSectionOrderField
  | EditableIndicatorsField
  | EditableClientLogosField
  | EditableHomeSolutionsField
  | EditableDirectorCardsField
  | EditableCardListField;

export type PageContentPatch =
  | { key: string; kind: "text"; value: string }
  | { key: string; kind: "richText"; value: string }
  | { key: string; kind: "image"; value: string; altText: string; objectPosition?: string }
  | { key: string; kind: "link"; value: string }
  | { key: string; kind: "backgroundImage"; value: string }
  | { key: string; kind: "sectionOrder"; value: string[] }
  | { key: string; kind: "indicators"; value: IndicatorItem[] }
  | { key: string; kind: "clientLogos"; value: ClientLogoItem[] }
  | { key: string; kind: "homeSolutions"; value: HomeSolutionCardItem[] }
  | { key: string; kind: "directorCards"; value: DirectorCardItem[] }
  | { key: string; kind: "cardList"; value: CardListItem[] };

export type InlineShortcutKind = "navigation" | "global" | "ffs";

export type InlineEditorBootstrap = {
  pageId: string;
  routePath: string;
  title: string;
  versionNumber: number;
  publishedVersionId: string | null;
  userRole: "admin" | "editor";
  canEditMedia: boolean;
  globalContent: Record<string, string>;
  fields: EditablePageField[];
  cardPrototypes?: Record<string, { items: string[]; connector?: string }>;
  navigationContent?: InlineNavigationContent;
};

export type InlineRevisionItem = {
  id: string;
  version: number;
  title: string;
  status: "draft" | "published" | "archived";
  createdAt: string;
  publishedAt: string | null;
  authorName: string | null;
  authorEmail: string | null;
};

export function cssUrl(value: string) {
  return `url("${value.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}")`;
}

export function replaceLastCssUrl(styleValue: string, imageUrl: string) {
  const urls = [...styleValue.matchAll(/url\(\s*(?:(['"])(.*?)\1|([^)]*))\s*\)/gi)];
  const lastUrl = urls.at(-1);
  if (!lastUrl || lastUrl.index === undefined) throw new Error("A imagem de fundo não existe mais no template.");
  return `${styleValue.slice(0, lastUrl.index)}${cssUrl(imageUrl)}${styleValue.slice(lastUrl.index + lastUrl[0].length)}`;
}

export function isValidObjectPosition(value: string): boolean {
  if (value === "") return true;
  return /^(?:100|[1-9]?\d)% (?:100|[1-9]?\d)%$/.test(value);
}

export function isSafeEditableLink(value: string) {
  if (value.length > 2_048 || /[\u0000-\u001f\u007f<>\\]/.test(value)) return false;
  if (!value) return true;
  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }
  if (/^(?:mailto:|tel:)/i.test(value)) return true;
  if (value.startsWith("//") || /^[a-z][a-z\d+.-]*:/i.test(value)) return false;
  return true;
}
