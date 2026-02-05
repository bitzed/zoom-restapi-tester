// Zoom API - Webinars Plus & Events
// Business Services > Webinars Plus & Events

registerCategory("Business Services", {
  name: "Webinars",
  description: "Webinar management endpoints",
  endpoints: [
    {
      method: "GET",
      path: "/users/{userId}/webinars",
      summary: "List webinars",
      description: "List all webinars scheduled by a user.",
      scopes: ["webinar:read:list_webinars:admin"],
      parameters: [
        { name: "userId", in: "path", type: "string", required: true, description: "User ID or email address" },
        { name: "type", in: "query", type: "string", required: false, description: "Webinar type", enum: ["scheduled", "upcoming"] },
        { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
        { name: "page_number", in: "query", type: "integer", required: false, description: "Page number", default: 1 }
      ]
    },
    {
      method: "POST",
      path: "/users/{userId}/webinars",
      summary: "Create webinar",
      description: "Create a webinar for a user.",
      scopes: ["webinar:write:webinar:admin"],
      parameters: [
        { name: "userId", in: "path", type: "string", required: true, description: "User ID or email address" }
      ],
      requestBody: {
        required: true,
        schema: {
          topic: { type: "string", required: false, description: "Webinar topic" },
          type: { type: "integer", required: false, description: "Webinar type (5: Webinar, 6: Recurring no fixed time, 9: Recurring fixed time)", enum: [5, 6, 9] },
          start_time: { type: "string", required: false, description: "Start time (ISO 8601)" },
          duration: { type: "integer", required: false, description: "Duration in minutes" },
          timezone: { type: "string", required: false, description: "Timezone" },
          password: { type: "string", required: false, description: "Password" },
          agenda: { type: "string", required: false, description: "Agenda" },
          settings: { type: "object", required: false, description: "Webinar settings" }
        },
        example: {
          topic: "My Webinar",
          type: 5,
          start_time: "2024-01-20T14:00:00Z",
          duration: 120,
          timezone: "America/New_York",
          settings: {
            host_video: true,
            panelists_video: true,
            practice_session: true,
            hd_video: true,
            approval_type: 0,
            registration_type: 1
          }
        }
      }
    },
    {
      method: "GET",
      path: "/webinars/{webinarId}",
      summary: "Get webinar",
      description: "Retrieve webinar details.",
      scopes: ["webinar:read:webinar:admin"],
      parameters: [
        { name: "webinarId", in: "path", type: "integer", required: true, description: "Webinar ID" },
        { name: "occurrence_id", in: "query", type: "string", required: false, description: "Occurrence ID" },
        { name: "show_previous_occurrences", in: "query", type: "boolean", required: false, description: "Show previous occurrences" }
      ]
    },
    {
      method: "PATCH",
      path: "/webinars/{webinarId}",
      summary: "Update webinar",
      description: "Update webinar details.",
      scopes: ["webinar:write:webinar:admin"],
      parameters: [
        { name: "webinarId", in: "path", type: "integer", required: true, description: "Webinar ID" },
        { name: "occurrence_id", in: "query", type: "string", required: false, description: "Occurrence ID" }
      ],
      requestBody: {
        required: true,
        schema: {
          topic: { type: "string", required: false, description: "Topic" },
          type: { type: "integer", required: false, description: "Type" },
          start_time: { type: "string", required: false, description: "Start time" },
          duration: { type: "integer", required: false, description: "Duration" },
          agenda: { type: "string", required: false, description: "Agenda" }
        },
        example: {
          topic: "Updated Webinar",
          duration: 90
        }
      }
    },
    {
      method: "DELETE",
      path: "/webinars/{webinarId}",
      summary: "Delete webinar",
      description: "Delete a webinar.",
      scopes: ["webinar:write:webinar:admin"],
      parameters: [
        { name: "webinarId", in: "path", type: "integer", required: true, description: "Webinar ID" },
        { name: "occurrence_id", in: "query", type: "string", required: false, description: "Occurrence ID" }
      ]
    },
    {
      method: "PUT",
      path: "/webinars/{webinarId}/status",
      summary: "Update webinar status",
      description: "End a webinar.",
      scopes: ["webinar:write:webinar:admin"],
      parameters: [
        { name: "webinarId", in: "path", type: "integer", required: true, description: "Webinar ID" }
      ],
      requestBody: {
        required: true,
        schema: {
          action: { type: "string", required: true, description: "Action", enum: ["end"] }
        },
        example: {
          action: "end"
        }
      }
    },
    {
      method: "GET",
      path: "/webinars/{webinarId}/registrants",
      summary: "List webinar registrants",
      description: "List all registrants for a webinar.",
      scopes: ["webinar:read:list_registrants:admin"],
      parameters: [
        { name: "webinarId", in: "path", type: "integer", required: true, description: "Webinar ID" },
        { name: "occurrence_id", in: "query", type: "string", required: false, description: "Occurrence ID" },
        { name: "status", in: "query", type: "string", required: false, description: "Status", enum: ["pending", "approved", "denied"] },
        { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
        { name: "page_number", in: "query", type: "integer", required: false, description: "Page number" }
      ]
    },
    {
      method: "POST",
      path: "/webinars/{webinarId}/registrants",
      summary: "Add webinar registrant",
      description: "Register a participant for a webinar.",
      scopes: ["webinar:write:registrant:admin"],
      parameters: [
        { name: "webinarId", in: "path", type: "integer", required: true, description: "Webinar ID" },
        { name: "occurrence_ids", in: "query", type: "string", required: false, description: "Occurrence IDs" }
      ],
      requestBody: {
        required: true,
        schema: {
          email: { type: "string", required: true, description: "Email" },
          first_name: { type: "string", required: true, description: "First name" },
          last_name: { type: "string", required: false, description: "Last name" },
          address: { type: "string", required: false, description: "Address" },
          city: { type: "string", required: false, description: "City" },
          country: { type: "string", required: false, description: "Country" },
          zip: { type: "string", required: false, description: "Zip code" },
          state: { type: "string", required: false, description: "State" },
          phone: { type: "string", required: false, description: "Phone number" },
          industry: { type: "string", required: false, description: "Industry" },
          org: { type: "string", required: false, description: "Organization" },
          job_title: { type: "string", required: false, description: "Job title" }
        },
        example: {
          email: "attendee@example.com",
          first_name: "John",
          last_name: "Smith"
        }
      }
    },
    {
      method: "PUT",
      path: "/webinars/{webinarId}/registrants/status",
      summary: "Update registrant status",
      description: "Approve or deny webinar registrants.",
      scopes: ["webinar:write:registrant:admin"],
      parameters: [
        { name: "webinarId", in: "path", type: "integer", required: true, description: "Webinar ID" },
        { name: "occurrence_id", in: "query", type: "string", required: false, description: "Occurrence ID" }
      ],
      requestBody: {
        required: true,
        schema: {
          action: { type: "string", required: true, description: "Action", enum: ["approve", "cancel", "deny"] },
          registrants: { type: "array", required: true, description: "Array of registrant objects" }
        },
        example: {
          action: "approve",
          registrants: [
            { id: "registrant-id-1" },
            { email: "registrant@example.com" }
          ]
        }
      }
    },
    {
      method: "GET",
      path: "/webinars/{webinarId}/panelists",
      summary: "List webinar panelists",
      description: "List all panelists for a webinar.",
      scopes: ["webinar:read:list_panelists:admin"],
      parameters: [
        { name: "webinarId", in: "path", type: "integer", required: true, description: "Webinar ID" }
      ]
    },
    {
      method: "POST",
      path: "/webinars/{webinarId}/panelists",
      summary: "Add webinar panelists",
      description: "Add panelists to a webinar.",
      scopes: ["webinar:write:panelist:admin"],
      parameters: [
        { name: "webinarId", in: "path", type: "integer", required: true, description: "Webinar ID" }
      ],
      requestBody: {
        required: true,
        schema: {
          panelists: { type: "array", required: true, description: "Array of panelist objects" }
        },
        example: {
          panelists: [
            { name: "Panelist 1", email: "panelist1@example.com" },
            { name: "Panelist 2", email: "panelist2@example.com" }
          ]
        }
      }
    },
    {
      method: "GET",
      path: "/webinars/{webinarId}/polls",
      summary: "List webinar polls",
      description: "List all polls for a webinar.",
      scopes: ["webinar:read:list_polls:admin"],
      parameters: [
        { name: "webinarId", in: "path", type: "integer", required: true, description: "Webinar ID" }
      ]
    },
    {
      method: "GET",
      path: "/past_webinars/{webinarId}",
      summary: "Get past webinar details",
      description: "Get details of a past webinar.",
      scopes: ["webinar:read:past_webinar:admin"],
      parameters: [
        { name: "webinarId", in: "path", type: "string", required: true, description: "Webinar UUID" }
      ]
    },
    {
      method: "GET",
      path: "/past_webinars/{webinarId}/participants",
      summary: "Get past webinar participants",
      description: "Get participants of a past webinar.",
      scopes: ["webinar:read:list_past_participants:admin"],
      parameters: [
        { name: "webinarId", in: "path", type: "string", required: true, description: "Webinar UUID" },
        { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
        { name: "next_page_token", in: "query", type: "string", required: false, description: "Next page token" }
      ]
    }
  ]
});
