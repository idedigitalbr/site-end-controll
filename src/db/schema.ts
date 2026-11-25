import {
  sql,
} from "drizzle-orm";
import {
  boolean,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const pages = mysqlTable(
  "pages",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    routePath: varchar("route_path", { length: 255 }).notNull(),
    templatePath: varchar("template_path", { length: 255 }),
    title: varchar("title", { length: 255 }).notNull(),
    summary: varchar("summary", { length: 500 }),
    pageType: mysqlEnum("page_type", ["home", "about", "privacy", "service", "system"])
      .notNull()
      .default("system"),
    status: mysqlEnum("status", ["draft", "published", "archived"])
      .notNull()
      .default("draft"),
    publishedVersionId: varchar("published_version_id", { length: 36 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  (table) => [
    uniqueIndex("pages_route_path_unique").on(table.routePath),
    index("pages_status_idx").on(table.status),
  ],
);

export const mediaAssets = mysqlTable(
  "cms_media_assets",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    fileName: varchar("file_name", { length: 64 }).notNull(),
    originalName: varchar("original_name", { length: 255 }).notNull(),
    sourcePath: varchar("source_path", { length: 1_000 }),
    mimeType: mysqlEnum("mime_type", ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]).notNull(),
    sizeBytes: int("size_bytes").notNull(),
    altText: varchar("alt_text", { length: 500 }).notNull().default(""),
    width: int("width"),
    height: int("height"),
    createdByUserId: varchar("created_by_user_id", { length: 36 }).references(() => user.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("cms_media_assets_file_name_unique").on(table.fileName),
    index("cms_media_assets_created_at_idx").on(table.createdAt),
    index("cms_media_assets_created_by_idx").on(table.createdByUserId),
  ],
);

export const siteSettings = mysqlTable("cms_site_settings", {
  id: varchar("id", { length: 20 }).primaryKey(),
  brandPrimary: varchar("brand_primary", { length: 7 }).notNull(),
  brandSecondary: varchar("brand_secondary", { length: 7 }).notNull(),
  backgroundPage: varchar("background_page", { length: 7 }).notNull(),
  backgroundPrimary: varchar("background_primary", { length: 7 }).notNull(),
  backgroundSecondary: varchar("background_secondary", { length: 7 }).notNull(),
  backgroundDeep: varchar("background_deep", { length: 7 }).notNull(),
  textPrimary: varchar("text_primary", { length: 7 }).notNull(),
  textSecondary: varchar("text_secondary", { length: 7 }).notNull(),
  textMuted: varchar("text_muted", { length: 7 }).notNull(),
  updatedAt: timestamp("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const user = mysqlTable("user", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`).notNull(),
  role: text("role"),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires", { fsp: 3 }),
});

export const session = mysqlTable(
  "session",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    expiresAt: timestamp("expires_at", { fsp: 3 }).notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    impersonatedBy: text("impersonated_by"),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = mysqlTable(
  "account",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { fsp: 3 }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { fsp: 3 }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`).notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = mysqlTable(
  "verification",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    identifier: varchar("identifier", { length: 255 }).notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { fsp: 3 }).notNull(),
    createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`).notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const pageVersions = mysqlTable(
  "page_versions",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    pageId: varchar("page_id", { length: 36 })
      .notNull()
      .references(() => pages.id, { onDelete: "cascade" }),
    version: int("version").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    summary: varchar("summary", { length: 500 }),
    content: json("content").$type<unknown[]>().notNull(),
    seoTitle: varchar("seo_title", { length: 255 }),
    seoDescription: varchar("seo_description", { length: 320 }),
    status: mysqlEnum("status", ["draft", "published", "archived"])
      .notNull()
      .default("draft"),
    publishedAt: timestamp("published_at"),
    createdByUserId: varchar("created_by_user_id", { length: 36 }).references(() => user.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("page_versions_page_version_unique").on(table.pageId, table.version),
    index("page_versions_status_idx").on(table.status),
    index("page_versions_created_by_idx").on(table.createdByUserId),
  ],
);

export const cmsPageAuditEvents = mysqlTable(
  "cms_page_audit_events",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    pageId: varchar("page_id", { length: 36 })
      .notNull()
      .references(() => pages.id, { onDelete: "cascade" }),
    actorUserId: varchar("actor_user_id", { length: 36 }).references(() => user.id, { onDelete: "set null" }),
    action: mysqlEnum("action", ["page_created", "draft_saved", "published", "unpublished", "restored"]).notNull(),
    versionId: varchar("version_id", { length: 36 }).references(() => pageVersions.id, { onDelete: "set null" }),
    sourceVersionId: varchar("source_version_id", { length: 36 }).references(() => pageVersions.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("cms_page_audit_events_page_created_idx").on(table.pageId, table.createdAt),
    index("cms_page_audit_events_actor_idx").on(table.actorUserId),
  ],
);

export const globalContentSettings = mysqlTable("cms_global_content", {
  id: varchar("id", { length: 20 }).primaryKey(),
  values: json("values").$type<Record<string, string>>().notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});
