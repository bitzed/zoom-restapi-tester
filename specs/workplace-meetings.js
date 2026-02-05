// Zoom API - Meetings
// Workplace > Meetings

registerCategory("Workplace", {
  name: "Meetings",
  description: "Meeting management endpoints",
  endpoints: [
    {
      method: "GET",
      path: "/users/{userId}/meetings",
      summary: "List meetings",
      description: "List all meetings scheduled by or for a user.",
      scopes: ["meeting:read:list_meetings:admin"],
      parameters: [
        { name: "userId", in: "path", type: "string", required: true, description: "User ID or email address" },
        { name: "type", in: "query", type: "string", required: false, description: "Meeting type filter", enum: ["scheduled", "live", "upcoming", "upcoming_meetings", "previous_meetings"] },
        { name: "page_size", in: "query", type: "integer", required: false, description: "Number of records per page", default: 30 },
        { name: "page_number", in: "query", type: "integer", required: false, description: "Page number", default: 1 }
      ]
    },
    {
      method: "POST",
      path: "/users/{userId}/meetings",
      summary: "Create meeting",
      description: "Create a meeting for a user.",
      scopes: ["meeting:write:meeting:admin"],
      parameters: [
        { name: "userId", in: "path", type: "string", required: true, description: "User ID or email address" }
      ],
      requestBody: {
        required: true,
        schema: {
          topic: { type: "string", required: false, description: "Meeting topic" },
          type: { type: "integer", required: false, description: "Meeting type (1: Instant, 2: Scheduled, 3: Recurring no fixed time, 8: Recurring fixed time)", enum: [1, 2, 3, 8] },
          start_time: { type: "string", required: false, description: "Meeting start time (ISO 8601)" },
          duration: { type: "integer", required: false, description: "Meeting duration in minutes" },
          timezone: { type: "string", required: false, description: "Timezone" },
          password: { type: "string", required: false, description: "Meeting password" },
          agenda: { type: "string", required: false, description: "Meeting agenda" },
          settings: { type: "object", required: false, description: "Meeting settings" }
        },
        example: {
          topic: "My Meeting",
          type: 2,
          start_time: "2024-01-15T10:00:00Z",
          duration: 60,
          timezone: "America/Los_Angeles",
          password: "123456",
          agenda: "Discuss project updates",
          settings: {
            host_video: true,
            participant_video: true,
            join_before_host: false,
            mute_upon_entry: true,
            waiting_room: true
          }
        }
      }
    },
    {
      method: "GET",
      path: "/meetings/{meetingId}",
      summary: "Get meeting",
      description: "Retrieve details of a meeting.",
      scopes: ["meeting:read:meeting:admin"],
      parameters: [
        { name: "meetingId", in: "path", type: "integer", required: true, description: "Meeting ID" },
        { name: "occurrence_id", in: "query", type: "string", required: false, description: "Occurrence ID for recurring meeting" },
        { name: "show_previous_occurrences", in: "query", type: "boolean", required: false, description: "Show previous occurrences" }
      ]
    },
    {
      method: "PATCH",
      path: "/meetings/{meetingId}",
      summary: "Update meeting",
      description: "Update meeting details.",
      scopes: ["meeting:write:meeting:admin"],
      parameters: [
        { name: "meetingId", in: "path", type: "integer", required: true, description: "Meeting ID" },
        { name: "occurrence_id", in: "query", type: "string", required: false, description: "Occurrence ID for recurring meeting" }
      ],
      requestBody: {
        required: true,
        schema: {
          topic: { type: "string", required: false, description: "Meeting topic" },
          type: { type: "integer", required: false, description: "Meeting type" },
          start_time: { type: "string", required: false, description: "Meeting start time" },
          duration: { type: "integer", required: false, description: "Duration in minutes" },
          timezone: { type: "string", required: false, description: "Timezone" },
          password: { type: "string", required: false, description: "Meeting password" },
          agenda: { type: "string", required: false, description: "Meeting agenda" }
        },
        example: {
          topic: "Updated Meeting Topic",
          duration: 90
        }
      }
    },
    {
      method: "DELETE",
      path: "/meetings/{meetingId}",
      summary: "Delete meeting",
      description: "Delete a meeting.",
      scopes: ["meeting:write:meeting:admin"],
      parameters: [
        { name: "meetingId", in: "path", type: "integer", required: true, description: "Meeting ID" },
        { name: "occurrence_id", in: "query", type: "string", required: false, description: "Occurrence ID" },
        { name: "schedule_for_reminder", in: "query", type: "boolean", required: false, description: "Send notification to host" }
      ]
    },
    {
      method: "PUT",
      path: "/meetings/{meetingId}/status",
      summary: "Update meeting status",
      description: "End a meeting for a host.",
      scopes: ["meeting:write:meeting:admin"],
      parameters: [
        { name: "meetingId", in: "path", type: "integer", required: true, description: "Meeting ID" }
      ],
      requestBody: {
        required: true,
        schema: {
          action: { type: "string", required: true, description: "Action to take", enum: ["end"] }
        },
        example: {
          action: "end"
        }
      }
    },
    {
      method: "GET",
      path: "/meetings/{meetingId}/registrants",
      summary: "List meeting registrants",
      description: "List all registrants for a meeting.",
      scopes: ["meeting:read:list_registrants:admin"],
      parameters: [
        { name: "meetingId", in: "path", type: "integer", required: true, description: "Meeting ID" },
        { name: "occurrence_id", in: "query", type: "string", required: false, description: "Occurrence ID" },
        { name: "status", in: "query", type: "string", required: false, description: "Registrant status", enum: ["pending", "approved", "denied"] },
        { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
        { name: "page_number", in: "query", type: "integer", required: false, description: "Page number", default: 1 }
      ]
    },
    {
      method: "POST",
      path: "/meetings/{meetingId}/registrants",
      summary: "Add meeting registrant",
      description: "Register a participant for a meeting.",
      scopes: ["meeting:write:registrant:admin"],
      parameters: [
        { name: "meetingId", in: "path", type: "integer", required: true, description: "Meeting ID" },
        { name: "occurrence_ids", in: "query", type: "string", required: false, description: "Occurrence IDs (comma-separated)" }
      ],
      requestBody: {
        required: true,
        schema: {
          email: { type: "string", required: true, description: "Registrant email" },
          first_name: { type: "string", required: true, description: "First name" },
          last_name: { type: "string", required: false, description: "Last name" }
        },
        example: {
          email: "registrant@example.com",
          first_name: "Jane",
          last_name: "Doe"
        }
      }
    },
    {
      method: "GET",
      path: "/past_meetings/{meetingId}",
      summary: "Get past meeting details",
      description: "Get details of a past meeting.",
      scopes: ["meeting:read:past_meeting:admin"],
      parameters: [
        { name: "meetingId", in: "path", type: "string", required: true, description: "Meeting UUID (double-encoded if starts with / or contains //)" }
      ]
    },
    {
      method: "GET",
      path: "/past_meetings/{meetingId}/participants",
      summary: "Get past meeting participants",
      description: "Get participants of a past meeting.",
      scopes: ["meeting:read:list_past_participants:admin"],
      parameters: [
        { name: "meetingId", in: "path", type: "string", required: true, description: "Meeting UUID" },
        { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
        { name: "next_page_token", in: "query", type: "string", required: false, description: "Next page token" }
      ]
    },
    {
      method: "GET",
      path: "/meetings/{meetingId}/invitation",
      summary: "Get meeting invitation",
      description: "Get the meeting invitation note for a meeting.",
      scopes: ["meeting:read:invitation:admin"],
      parameters: [
        { name: "meetingId", in: "path", type: "integer", required: true, description: "Meeting ID" }
      ]
    },
    {
      method: "GET",
      path: "/meetings/{meetingId}/polls",
      summary: "List meeting polls",
      description: "List all polls of a meeting.",
      scopes: ["meeting:read:list_polls:admin"],
      parameters: [
        { name: "meetingId", in: "path", type: "integer", required: true, description: "Meeting ID" },
        { name: "anonymous", in: "query", type: "boolean", required: false, description: "Anonymous poll" }
      ]
    },
    {
      method: "POST",
      path: "/meetings/{meetingId}/polls",
      summary: "Create meeting poll",
      description: "Create a poll for a meeting.",
      scopes: ["meeting:write:poll:admin"],
      parameters: [
        { name: "meetingId", in: "path", type: "integer", required: true, description: "Meeting ID" }
      ],
      requestBody: {
        required: true,
        schema: {
          title: { type: "string", required: true, description: "Poll title" },
          anonymous: { type: "boolean", required: false, description: "Anonymous poll" },
          poll_type: { type: "integer", required: false, description: "Poll type (1: Poll, 2: Quiz)", enum: [1, 2] },
          questions: { type: "array", required: true, description: "Array of question objects" }
        },
        example: {
          title: "Meeting Poll",
          anonymous: false,
          poll_type: 1,
          questions: [
            {
              name: "How satisfied are you?",
              type: "single",
              answers: ["Very satisfied", "Satisfied", "Neutral", "Unsatisfied"]
            }
          ]
        }
      }
    }
  ]
});
