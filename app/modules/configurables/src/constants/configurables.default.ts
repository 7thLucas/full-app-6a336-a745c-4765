/*
 * Default Configurable Data — seeded into Mongo on first boot.
 *
 * BEFORE EDITING: read ./RULES.md (especially R5: schema and defaults must
 * stay in sync) and ./configurables.schema.ts. For per-type schema and
 * default-value samples, see RULES.md §5 "Field Type Reference".
 */

export type TBrandColor = {
  primary: string;
  secondary: string;
  accent: string;
};

export type TDefaultConfigurableData = {
  appName: string;
  logoUrl: string;
  brandColor: TBrandColor;
  appTagline?: string;
  appDescription?: string;
  backgroundColor?: string;
  surfaceColor?: string;
  textPrimaryColor?: string;
  textSecondaryColor?: string;
  starColor?: string;
  welcomeMessage?: string;
  emptyStateMessage?: string;
  logVisitCTA?: string;
  recommendationsHeading?: string;
  personalTrackLabel?: string;
  communityTrackLabel?: string;
  defaultVisitsPerPage?: number;
  enablePhotoUpload?: boolean;
  enableRecommendations?: boolean;
};

export const defaultConfigurablesData: TDefaultConfigurableData = {
  appName: "Cafessistant",
  logoUrl: "FILL_LOGO_URL_HERE",
  brandColor: {
    primary: "#2C1A0E",
    secondary: "#EDE6D6",
    accent: "#C97C3A",
  },
  appTagline: "Your personal coffee atlas",
  appDescription: "Track every coffee shop visit, revisit your favourites, and discover great new spots in every city.",
  backgroundColor: "#F5F0E8",
  surfaceColor: "#EDE6D6",
  textPrimaryColor: "#1C1C1C",
  textSecondaryColor: "#7A6F65",
  starColor: "#E8A838",
  welcomeMessage: "Welcome back, coffee explorer",
  emptyStateMessage: "Start your coffee atlas — log your first visit",
  logVisitCTA: "Log a visit",
  recommendationsHeading: "Where to go next",
  personalTrackLabel: "Places you've loved here",
  communityTrackLabel: "New to discover",
  defaultVisitsPerPage: 20,
  enablePhotoUpload: true,
  enableRecommendations: true,
};
