/* START: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */
export interface FieldSchemaType {
  fieldName?: string;
  type:
    | "string"
    | "number"
    | "boolean"
    | "object"
    | "array"
    | "color"
    | "url"
    | "enum"
    | "datetime"
    | "file"
    | "files";
  required?: boolean;
  label?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: string[];
  fields?: FieldSchemaType[];
  item?: FieldSchemaType;
}
/* END: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */

export type ConfigurableSchemas = {
  formSchema: FieldSchemaType[];
};



export const configurableSchemas: ConfigurableSchemas = {
  formSchema: [
    {
      fieldName: "appName",
      type: "string",
      required: true,
      label: "App Name",
    },
    {
      fieldName: "logoUrl",
      type: "url",
      required: true,
      label: "Logo URL",
    },
    {
      fieldName: "brandColor",
      type: "object",
      required: true,
      label: "Brand Color",
      fields: [
        {
          fieldName: "primary",
          type: "color",
          required: true,
          label: "Primary",
        },
        {
          fieldName: "secondary",
          type: "color",
          required: true,
          label: "Secondary",
        },
        {
          fieldName: "accent",
          type: "color",
          required: true,
          label: "Accent",
        },
      ],
    },
    {
      fieldName: "appTagline",
      type: "string",
      required: false,
      label: "App Tagline",
      maxLength: 120,
    },
    {
      fieldName: "appDescription",
      type: "string",
      required: false,
      label: "App Description",
      maxLength: 300,
    },
    {
      fieldName: "backgroundColor",
      type: "color",
      required: false,
      label: "Background Color",
    },
    {
      fieldName: "surfaceColor",
      type: "color",
      required: false,
      label: "Surface / Card Color",
    },
    {
      fieldName: "textPrimaryColor",
      type: "color",
      required: false,
      label: "Primary Text Color",
    },
    {
      fieldName: "textSecondaryColor",
      type: "color",
      required: false,
      label: "Secondary Text Color",
    },
    {
      fieldName: "starColor",
      type: "color",
      required: false,
      label: "Star Rating Color",
    },
    {
      fieldName: "welcomeMessage",
      type: "string",
      required: false,
      label: "Welcome Message",
      maxLength: 100,
    },
    {
      fieldName: "emptyStateMessage",
      type: "string",
      required: false,
      label: "Empty State Message",
      maxLength: 150,
    },
    {
      fieldName: "logVisitCTA",
      type: "string",
      required: false,
      label: "Log Visit Button Label",
      maxLength: 40,
    },
    {
      fieldName: "recommendationsHeading",
      type: "string",
      required: false,
      label: "Recommendations Section Heading",
      maxLength: 60,
    },
    {
      fieldName: "personalTrackLabel",
      type: "string",
      required: false,
      label: "Personal Recommendations Track Label",
      maxLength: 50,
    },
    {
      fieldName: "communityTrackLabel",
      type: "string",
      required: false,
      label: "Community Recommendations Track Label",
      maxLength: 50,
    },
    {
      fieldName: "defaultVisitsPerPage",
      type: "number",
      required: false,
      label: "Visits Per Page (History)",
      min: 5,
      max: 50,
    },
    {
      fieldName: "enablePhotoUpload",
      type: "boolean",
      required: false,
      label: "Enable Photo Upload on Visit Logs",
    },
    {
      fieldName: "enableRecommendations",
      type: "boolean",
      required: false,
      label: "Enable Recommendations Engine",
    },
  ],
};
