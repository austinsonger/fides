import { baseApi } from "~/features/common/api.slice";
import {
  MinimalProperty,
  Page_MessagingTemplateWithPropertiesSummary_,
} from "~/types/api";
import { BulkUpdateFailed } from "~/types/api/models/BulkUpdateFailed";

export type MessagingTemplate = {
  type: string;
  label: string;
  content: {
    subject: string;
    body: string;
  };
};

export type BulkPutMessagingTemplateResponse = {
  succeeded: MessagingTemplate[];
  failed: BulkUpdateFailed[];
};

export type MessagingTemplateResponse = {
  type: string;
  id?: string; // not on default response
  is_enabled: boolean;
  content: {
    subject: string;
    body: string;
  };
  properties?: MinimalProperty[]; // not on default response
};

export type MessagingTemplateDefaultResponse = {
  type: string;
  is_enabled: boolean;
  content: {
    subject: string;
    body: string;
  };
};

export type MessagingTemplateCreateOrUpdate = {
  is_enabled?: boolean;
  content?: {
    subject: string;
    body: string;
  };
  properties?: string[];
};

export type MessagingTemplatePatch = {
  templateId: string;
  template: Partial<MessagingTemplateCreateOrUpdate>;
};

export type MessagingTemplateUpdate = {
  templateId: string;
  template: MessagingTemplateCreateOrUpdate;
};

export type MessagingTemplateCreate = {
  templateType: string;
  template: MessagingTemplateCreateOrUpdate;
};

// Messaging Templates API
const messagingTemplatesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMessagingTemplates: build.query<MessagingTemplate[], void>({
      query: () => ({ url: `messaging/templates` }),
      providesTags: () => ["Messaging Templates"],
    }),
    getSummaryMessagingTemplates: build.query<
      Page_MessagingTemplateWithPropertiesSummary_,
      any
    >({
      query: (params) => ({
        method: "GET",
        url: `messaging/templates/summary`,
        params,
      }),
      providesTags: () => ["Property-Specific Messaging Templates"],
    }),
    updateMessagingTemplates: build.mutation<
      BulkPutMessagingTemplateResponse,
      MessagingTemplate[]
    >({
      query: (templates) => ({
        url: `messaging/templates`,
        method: "PUT",
        body: templates,
      }),
      invalidatesTags: () => ["Property-Specific Messaging Templates"],
    }),
    // Render data from existing template- GET by id
    getMessagingTemplateById: build.query<MessagingTemplateResponse, string>({
      query: (templateId: string) => ({
        url: `/messaging/templates/${templateId}`,
      }),
      providesTags: () => ["Property-Specific Messaging Templates"],
    }),
    // Update existing template
    putMessagingTemplateById: build.mutation<
      MessagingTemplateResponse,
      MessagingTemplateUpdate
    >({
      query: ({ templateId, template }) => ({
        url: `/messaging/templates/${templateId}`,
        method: "PUT",
        body: template,
      }),
      invalidatesTags: () => ["Property-Specific Messaging Templates"],
    }),
    // Update existing template
    patchMessagingTemplateById: build.mutation<
      MessagingTemplateResponse,
      MessagingTemplatePatch
    >({
      query: ({ templateId, template }) => ({
        url: `/messaging/templates/${templateId}`,
        method: "PATCH",
        body: template,
      }),
      invalidatesTags: () => ["Property-Specific Messaging Templates"],
    }),
    // endpoint for rendering data for default template- GET by type
    getMessagingTemplateDefault: build.query<
      MessagingTemplateDefaultResponse,
      string
    >({
      query: (templateType: string) => ({
        url: `/messaging/templates/default/${templateType}`,
      }),
    }),
    // endpoint for creating new messaging template- POST by type
    createMessagingTemplateByType: build.mutation<
      MessagingTemplateResponse,
      MessagingTemplateCreate
    >({
      query: ({ templateType, template }) => ({
        url: `/messaging/templates/${templateType}`,
        method: "POST",
        body: template,
      }),
      invalidatesTags: () => ["Property-Specific Messaging Templates"],
    }),
    // delete template by id
    deleteMessagingTemplateById: build.mutation<void, string>({
      query: (templateId: string) => ({
        url: `/messaging/templates/${templateId}`,
        method: "DELETE",
      }),
      invalidatesTags: () => ["Property-Specific Messaging Templates"],
    }),
  }),
});

export const {
  useGetMessagingTemplatesQuery,
  useUpdateMessagingTemplatesMutation,
  useGetSummaryMessagingTemplatesQuery,
  useGetMessagingTemplateByIdQuery,
  usePutMessagingTemplateByIdMutation,
  useGetMessagingTemplateDefaultQuery,
  useCreateMessagingTemplateByTypeMutation,
  useDeleteMessagingTemplateByIdMutation,
  usePatchMessagingTemplateByIdMutation,
} = messagingTemplatesApi;
