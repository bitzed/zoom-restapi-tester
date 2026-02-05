// Zoom API - Cloud Recording
// Workplace > Clips/Recording

registerCategory("Workplace", {
  name: "Cloud Recording",
  description: "Cloud recording management",
  endpoints: [
    {
      method: "GET",
      path: "/users/{userId}/recordings",
      summary: "List recordings",
      description: "List all cloud recordings for a user.",
      scopes: ["cloud_recording:read:list_user_recordings:admin"],
      parameters: [
        { name: "userId", in: "path", type: "string", required: true, description: "User ID or email" },
        { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
        { name: "next_page_token", in: "query", type: "string", required: false, description: "Next page token" },
        { name: "from", in: "query", type: "string", required: false, description: "Start date (yyyy-mm-dd)" },
        { name: "to", in: "query", type: "string", required: false, description: "End date (yyyy-mm-dd)" },
        { name: "trash", in: "query", type: "boolean", required: false, description: "List recordings in trash" }
      ]
    },
    {
      method: "GET",
      path: "/meetings/{meetingId}/recordings",
      summary: "Get meeting recordings",
      description: "Get all recordings for a meeting.",
      scopes: ["cloud_recording:read:list_recording_files:admin"],
      parameters: [
        { name: "meetingId", in: "path", type: "string", required: true, description: "Meeting ID or UUID" },
        { name: "include_fields", in: "query", type: "string", required: false, description: "Include fields", enum: ["download_access_token", "participant_audio_transcript"] }
      ]
    },
    {
      method: "DELETE",
      path: "/meetings/{meetingId}/recordings",
      summary: "Delete meeting recordings",
      description: "Delete all recordings for a meeting.",
      scopes: ["cloud_recording:write:delete_recording:admin"],
      parameters: [
        { name: "meetingId", in: "path", type: "string", required: true, description: "Meeting ID or UUID" },
        { name: "action", in: "query", type: "string", required: false, description: "Action", enum: ["trash", "delete"] }
      ]
    },
    {
      method: "DELETE",
      path: "/meetings/{meetingId}/recordings/{recordingId}",
      summary: "Delete recording file",
      description: "Delete a specific recording file.",
      scopes: ["cloud_recording:write:delete_recording:admin"],
      parameters: [
        { name: "meetingId", in: "path", type: "string", required: true, description: "Meeting ID or UUID" },
        { name: "recordingId", in: "path", type: "string", required: true, description: "Recording ID" },
        { name: "action", in: "query", type: "string", required: false, description: "Action", enum: ["trash", "delete"] }
      ]
    },
    {
      method: "PUT",
      path: "/meetings/{meetingId}/recordings/status",
      summary: "Recover meeting recordings",
      description: "Recover recordings from trash.",
      scopes: ["cloud_recording:write:recording:admin"],
      parameters: [
        { name: "meetingId", in: "path", type: "string", required: true, description: "Meeting ID or UUID" }
      ],
      requestBody: {
        required: true,
        schema: {
          action: { type: "string", required: true, description: "Action to perform", enum: ["recover"] }
        },
        example: {
          action: "recover"
        }
      }
    },
    {
      method: "GET",
      path: "/meetings/{meetingId}/recordings/settings",
      summary: "Get recording settings",
      description: "Get settings for a meeting recording.",
      scopes: ["cloud_recording:read:settings:admin"],
      parameters: [
        { name: "meetingId", in: "path", type: "string", required: true, description: "Meeting ID or UUID" }
      ]
    },
    {
      method: "PATCH",
      path: "/meetings/{meetingId}/recordings/settings",
      summary: "Update recording settings",
      description: "Update settings for a meeting recording.",
      scopes: ["cloud_recording:write:settings:admin"],
      parameters: [
        { name: "meetingId", in: "path", type: "string", required: true, description: "Meeting ID or UUID" }
      ],
      requestBody: {
        required: true,
        schema: {
          share_recording: { type: "string", required: false, description: "Share recording option", enum: ["publicly", "internally", "none"] },
          recording_authentication: { type: "boolean", required: false, description: "Require authentication" },
          authentication_option: { type: "string", required: false, description: "Authentication option" },
          viewer_download: { type: "boolean", required: false, description: "Allow download" },
          password: { type: "string", required: false, description: "Password" },
          on_demand: { type: "boolean", required: false, description: "On-demand recording" },
          approval_type: { type: "integer", required: false, description: "Approval type", enum: [0, 1, 2] }
        },
        example: {
          share_recording: "internally",
          viewer_download: true,
          on_demand: false
        }
      }
    },
    {
      method: "GET",
      path: "/meetings/{meetingId}/recordings/registrants",
      summary: "List recording registrants",
      description: "List all registrants for an on-demand recording.",
      scopes: ["cloud_recording:read:list_registrants:admin"],
      parameters: [
        { name: "meetingId", in: "path", type: "string", required: true, description: "Meeting ID" },
        { name: "status", in: "query", type: "string", required: false, description: "Status filter", enum: ["pending", "approved", "denied"] },
        { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
        { name: "page_number", in: "query", type: "integer", required: false, description: "Page number" }
      ]
    },
    {
      method: "POST",
      path: "/meetings/{meetingId}/recordings/registrants",
      summary: "Create recording registrant",
      description: "Register a user for an on-demand recording.",
      scopes: ["cloud_recording:write:registrant:admin"],
      parameters: [
        { name: "meetingId", in: "path", type: "string", required: true, description: "Meeting ID" }
      ],
      requestBody: {
        required: true,
        schema: {
          email: { type: "string", required: true, description: "Registrant email" },
          first_name: { type: "string", required: true, description: "First name" },
          last_name: { type: "string", required: false, description: "Last name" }
        },
        example: {
          email: "viewer@example.com",
          first_name: "John",
          last_name: "Doe"
        }
      }
    }
  ]
});
