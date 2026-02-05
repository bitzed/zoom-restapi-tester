// Zoom API Specification
// Based on https://github.com/zoom/api OpenAPI spec

const ZOOM_API_SPEC = {
  info: {
    title: "Zoom API",
    version: "2.0.0",
    baseUrl: "https://api.zoom.us/v2"
  },
  categories: [
    {
      name: "Users",
      description: "User management endpoints",
      endpoints: [
        {
          method: "GET",
          path: "/users",
          summary: "List users",
          description: "List all users on your Zoom account.",
          scopes: ["user:read:admin"],
          parameters: [
            { name: "status", in: "query", type: "string", required: false, description: "Filter by user status (active, inactive, pending)", enum: ["active", "inactive", "pending"] },
            { name: "page_size", in: "query", type: "integer", required: false, description: "Number of records per page (max 300)", default: 30 },
            { name: "page_number", in: "query", type: "integer", required: false, description: "Page number", default: 1 },
            { name: "role_id", in: "query", type: "string", required: false, description: "Filter by role ID" }
          ]
        },
        {
          method: "POST",
          path: "/users",
          summary: "Create user",
          description: "Create a new user on your Zoom account.",
          scopes: ["user:write:admin"],
          parameters: [],
          requestBody: {
            required: true,
            schema: {
              action: { type: "string", required: true, description: "Action to take (create, autoCreate, custCreate, ssoCreate)", enum: ["create", "autoCreate", "custCreate", "ssoCreate"] },
              user_info: {
                type: "object",
                properties: {
                  email: { type: "string", required: true, description: "User email address" },
                  type: { type: "integer", required: true, description: "User type (1: Basic, 2: Licensed, 3: On-prem)", enum: [1, 2, 3] },
                  first_name: { type: "string", required: false, description: "First name" },
                  last_name: { type: "string", required: false, description: "Last name" }
                }
              }
            },
            example: {
              action: "create",
              user_info: {
                email: "user@example.com",
                type: 1,
                first_name: "John",
                last_name: "Doe"
              }
            }
          }
        },
        {
          method: "GET",
          path: "/users/{userId}",
          summary: "Get user",
          description: "Get information about a specific user.",
          scopes: ["user:read:admin", "user:read"],
          parameters: [
            { name: "userId", in: "path", type: "string", required: true, description: "User ID or email address. Use 'me' for current user." }
          ]
        },
        {
          method: "PATCH",
          path: "/users/{userId}",
          summary: "Update user",
          description: "Update a user's profile information.",
          scopes: ["user:write:admin", "user:write"],
          parameters: [
            { name: "userId", in: "path", type: "string", required: true, description: "User ID or email address" }
          ],
          requestBody: {
            required: true,
            schema: {
              first_name: { type: "string", required: false, description: "First name" },
              last_name: { type: "string", required: false, description: "Last name" },
              type: { type: "integer", required: false, description: "User type" },
              pmi: { type: "integer", required: false, description: "Personal Meeting ID" },
              timezone: { type: "string", required: false, description: "User timezone" },
              dept: { type: "string", required: false, description: "Department" },
              job_title: { type: "string", required: false, description: "Job title" },
              company: { type: "string", required: false, description: "Company name" }
            },
            example: {
              first_name: "John",
              last_name: "Doe",
              dept: "Engineering"
            }
          }
        },
        {
          method: "DELETE",
          path: "/users/{userId}",
          summary: "Delete user",
          description: "Delete a user from your Zoom account.",
          scopes: ["user:write:admin"],
          parameters: [
            { name: "userId", in: "path", type: "string", required: true, description: "User ID or email address" },
            { name: "action", in: "query", type: "string", required: false, description: "Delete action (delete, disassociate)", enum: ["delete", "disassociate"] }
          ]
        },
        {
          method: "GET",
          path: "/users/{userId}/settings",
          summary: "Get user settings",
          description: "Retrieve a user's settings.",
          scopes: ["user:read:admin", "user:read"],
          parameters: [
            { name: "userId", in: "path", type: "string", required: true, description: "User ID or email address" },
            { name: "option", in: "query", type: "string", required: false, description: "Settings option", enum: ["meeting_authentication", "recording_authentication"] }
          ]
        },
        {
          method: "PATCH",
          path: "/users/{userId}/settings",
          summary: "Update user settings",
          description: "Update a user's settings.",
          scopes: ["user:write:admin", "user:write"],
          parameters: [
            { name: "userId", in: "path", type: "string", required: true, description: "User ID or email address" }
          ],
          requestBody: {
            required: true,
            schema: {
              schedule_meeting: { type: "object", required: false, description: "Schedule meeting settings" },
              in_meeting: { type: "object", required: false, description: "In-meeting settings" },
              email_notification: { type: "object", required: false, description: "Email notification settings" },
              recording: { type: "object", required: false, description: "Recording settings" }
            },
            example: {
              schedule_meeting: {
                host_video: true,
                participants_video: true
              }
            }
          }
        }
      ]
    },
    {
      name: "Meetings",
      description: "Meeting management endpoints",
      endpoints: [
        {
          method: "GET",
          path: "/users/{userId}/meetings",
          summary: "List meetings",
          description: "List all meetings scheduled by or for a user.",
          scopes: ["meeting:read:admin", "meeting:read"],
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
          scopes: ["meeting:write:admin", "meeting:write"],
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
          scopes: ["meeting:read:admin", "meeting:read"],
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
          scopes: ["meeting:write:admin", "meeting:write"],
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
          scopes: ["meeting:write:admin", "meeting:write"],
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
          scopes: ["meeting:write:admin", "meeting:write"],
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
          scopes: ["meeting:read:admin", "meeting:read"],
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
          scopes: ["meeting:write:admin", "meeting:write"],
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
          scopes: ["meeting:read:admin", "meeting:read"],
          parameters: [
            { name: "meetingId", in: "path", type: "string", required: true, description: "Meeting UUID (double-encoded if starts with / or contains //)" }
          ]
        },
        {
          method: "GET",
          path: "/past_meetings/{meetingId}/participants",
          summary: "Get past meeting participants",
          description: "Get participants of a past meeting.",
          scopes: ["meeting:read:admin", "meeting:read"],
          parameters: [
            { name: "meetingId", in: "path", type: "string", required: true, description: "Meeting UUID" },
            { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
            { name: "next_page_token", in: "query", type: "string", required: false, description: "Next page token" }
          ]
        }
      ]
    },
    {
      name: "Webinars",
      description: "Webinar management endpoints",
      endpoints: [
        {
          method: "GET",
          path: "/users/{userId}/webinars",
          summary: "List webinars",
          description: "List all webinars scheduled by a user.",
          scopes: ["webinar:read:admin", "webinar:read"],
          parameters: [
            { name: "userId", in: "path", type: "string", required: true, description: "User ID or email address" },
            { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
            { name: "page_number", in: "query", type: "integer", required: false, description: "Page number", default: 1 }
          ]
        },
        {
          method: "POST",
          path: "/users/{userId}/webinars",
          summary: "Create webinar",
          description: "Create a webinar for a user.",
          scopes: ["webinar:write:admin", "webinar:write"],
          parameters: [
            { name: "userId", in: "path", type: "string", required: true, description: "User ID or email address" }
          ],
          requestBody: {
            required: true,
            schema: {
              topic: { type: "string", required: false, description: "Webinar topic" },
              type: { type: "integer", required: false, description: "Webinar type (5: Webinar, 6: Recurring no fixed time, 9: Recurring fixed time)", enum: [5, 6, 9] },
              start_time: { type: "string", required: false, description: "Start time" },
              duration: { type: "integer", required: false, description: "Duration in minutes" },
              timezone: { type: "string", required: false, description: "Timezone" },
              password: { type: "string", required: false, description: "Password" },
              agenda: { type: "string", required: false, description: "Agenda" }
            },
            example: {
              topic: "My Webinar",
              type: 5,
              start_time: "2024-01-20T14:00:00Z",
              duration: 120,
              timezone: "America/New_York"
            }
          }
        },
        {
          method: "GET",
          path: "/webinars/{webinarId}",
          summary: "Get webinar",
          description: "Retrieve webinar details.",
          scopes: ["webinar:read:admin", "webinar:read"],
          parameters: [
            { name: "webinarId", in: "path", type: "integer", required: true, description: "Webinar ID" },
            { name: "occurrence_id", in: "query", type: "string", required: false, description: "Occurrence ID" }
          ]
        },
        {
          method: "PATCH",
          path: "/webinars/{webinarId}",
          summary: "Update webinar",
          description: "Update webinar details.",
          scopes: ["webinar:write:admin", "webinar:write"],
          parameters: [
            { name: "webinarId", in: "path", type: "integer", required: true, description: "Webinar ID" }
          ],
          requestBody: {
            required: true,
            schema: {
              topic: { type: "string", required: false, description: "Topic" },
              type: { type: "integer", required: false, description: "Type" },
              start_time: { type: "string", required: false, description: "Start time" },
              duration: { type: "integer", required: false, description: "Duration" }
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
          scopes: ["webinar:write:admin", "webinar:write"],
          parameters: [
            { name: "webinarId", in: "path", type: "integer", required: true, description: "Webinar ID" },
            { name: "occurrence_id", in: "query", type: "string", required: false, description: "Occurrence ID" }
          ]
        },
        {
          method: "GET",
          path: "/webinars/{webinarId}/registrants",
          summary: "List webinar registrants",
          description: "List all registrants for a webinar.",
          scopes: ["webinar:read:admin", "webinar:read"],
          parameters: [
            { name: "webinarId", in: "path", type: "integer", required: true, description: "Webinar ID" },
            { name: "occurrence_id", in: "query", type: "string", required: false, description: "Occurrence ID" },
            { name: "status", in: "query", type: "string", required: false, description: "Status", enum: ["pending", "approved", "denied"] },
            { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 }
          ]
        },
        {
          method: "POST",
          path: "/webinars/{webinarId}/registrants",
          summary: "Add webinar registrant",
          description: "Register a participant for a webinar.",
          scopes: ["webinar:write:admin", "webinar:write"],
          parameters: [
            { name: "webinarId", in: "path", type: "integer", required: true, description: "Webinar ID" }
          ],
          requestBody: {
            required: true,
            schema: {
              email: { type: "string", required: true, description: "Email" },
              first_name: { type: "string", required: true, description: "First name" },
              last_name: { type: "string", required: false, description: "Last name" }
            },
            example: {
              email: "attendee@example.com",
              first_name: "John",
              last_name: "Smith"
            }
          }
        }
      ]
    },
    {
      name: "Cloud Recording",
      description: "Cloud recording management",
      endpoints: [
        {
          method: "GET",
          path: "/users/{userId}/recordings",
          summary: "List recordings",
          description: "List all cloud recordings for a user.",
          scopes: ["recording:read:admin", "recording:read"],
          parameters: [
            { name: "userId", in: "path", type: "string", required: true, description: "User ID or email" },
            { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
            { name: "next_page_token", in: "query", type: "string", required: false, description: "Next page token" },
            { name: "from", in: "query", type: "string", required: false, description: "Start date (yyyy-mm-dd)" },
            { name: "to", in: "query", type: "string", required: false, description: "End date (yyyy-mm-dd)" }
          ]
        },
        {
          method: "GET",
          path: "/meetings/{meetingId}/recordings",
          summary: "Get meeting recordings",
          description: "Get all recordings for a meeting.",
          scopes: ["recording:read:admin", "recording:read"],
          parameters: [
            { name: "meetingId", in: "path", type: "string", required: true, description: "Meeting ID or UUID" },
            { name: "include_fields", in: "query", type: "string", required: false, description: "Include fields", enum: ["download_access_token"] }
          ]
        },
        {
          method: "DELETE",
          path: "/meetings/{meetingId}/recordings",
          summary: "Delete meeting recordings",
          description: "Delete all recordings for a meeting.",
          scopes: ["recording:write:admin", "recording:write"],
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
          scopes: ["recording:write:admin", "recording:write"],
          parameters: [
            { name: "meetingId", in: "path", type: "string", required: true, description: "Meeting ID or UUID" },
            { name: "recordingId", in: "path", type: "string", required: true, description: "Recording ID" },
            { name: "action", in: "query", type: "string", required: false, description: "Action", enum: ["trash", "delete"] }
          ]
        },
        {
          method: "GET",
          path: "/meetings/{meetingId}/recordings/settings",
          summary: "Get recording settings",
          description: "Get settings for a meeting recording.",
          scopes: ["recording:read:admin", "recording:read"],
          parameters: [
            { name: "meetingId", in: "path", type: "string", required: true, description: "Meeting ID or UUID" }
          ]
        },
        {
          method: "PATCH",
          path: "/meetings/{meetingId}/recordings/settings",
          summary: "Update recording settings",
          description: "Update settings for a meeting recording.",
          scopes: ["recording:write:admin", "recording:write"],
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
              on_demand: { type: "boolean", required: false, description: "On-demand recording" }
            },
            example: {
              share_recording: "internally",
              viewer_download: true
            }
          }
        }
      ]
    },
    {
      name: "Reports",
      description: "Reports and analytics endpoints",
      endpoints: [
        {
          method: "GET",
          path: "/report/daily",
          summary: "Get daily usage report",
          description: "Get daily usage report for a date range.",
          scopes: ["report:read:admin"],
          parameters: [
            { name: "year", in: "query", type: "integer", required: false, description: "Year" },
            { name: "month", in: "query", type: "integer", required: false, description: "Month (1-12)" }
          ]
        },
        {
          method: "GET",
          path: "/report/users",
          summary: "Get active/inactive host report",
          description: "Get report of active or inactive hosts.",
          scopes: ["report:read:admin"],
          parameters: [
            { name: "from", in: "query", type: "string", required: true, description: "Start date (yyyy-mm-dd)" },
            { name: "to", in: "query", type: "string", required: true, description: "End date (yyyy-mm-dd)" },
            { name: "type", in: "query", type: "string", required: false, description: "User type", enum: ["active", "inactive"] },
            { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
            { name: "page_number", in: "query", type: "integer", required: false, description: "Page number", default: 1 }
          ]
        },
        {
          method: "GET",
          path: "/report/users/{userId}/meetings",
          summary: "Get meeting reports",
          description: "Get meeting reports for a user.",
          scopes: ["report:read:admin"],
          parameters: [
            { name: "userId", in: "path", type: "string", required: true, description: "User ID" },
            { name: "from", in: "query", type: "string", required: true, description: "Start date" },
            { name: "to", in: "query", type: "string", required: true, description: "End date" },
            { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
            { name: "next_page_token", in: "query", type: "string", required: false, description: "Next page token" }
          ]
        },
        {
          method: "GET",
          path: "/report/meetings/{meetingId}",
          summary: "Get meeting detail report",
          description: "Get detailed report for a past meeting.",
          scopes: ["report:read:admin"],
          parameters: [
            { name: "meetingId", in: "path", type: "string", required: true, description: "Meeting ID or UUID" }
          ]
        },
        {
          method: "GET",
          path: "/report/meetings/{meetingId}/participants",
          summary: "Get meeting participant report",
          description: "Get participant report for a past meeting.",
          scopes: ["report:read:admin"],
          parameters: [
            { name: "meetingId", in: "path", type: "string", required: true, description: "Meeting ID or UUID" },
            { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
            { name: "next_page_token", in: "query", type: "string", required: false, description: "Next page token" },
            { name: "include_fields", in: "query", type: "string", required: false, description: "Include fields", enum: ["registrant_id"] }
          ]
        },
        {
          method: "GET",
          path: "/report/webinars/{webinarId}",
          summary: "Get webinar detail report",
          description: "Get detailed report for a past webinar.",
          scopes: ["report:read:admin"],
          parameters: [
            { name: "webinarId", in: "path", type: "string", required: true, description: "Webinar ID or UUID" }
          ]
        },
        {
          method: "GET",
          path: "/report/webinars/{webinarId}/participants",
          summary: "Get webinar participant report",
          description: "Get participant report for a past webinar.",
          scopes: ["report:read:admin"],
          parameters: [
            { name: "webinarId", in: "path", type: "string", required: true, description: "Webinar ID or UUID" },
            { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
            { name: "next_page_token", in: "query", type: "string", required: false, description: "Next page token" }
          ]
        }
      ]
    },
    {
      name: "Accounts",
      description: "Account management endpoints",
      endpoints: [
        {
          method: "GET",
          path: "/accounts",
          summary: "List sub accounts",
          description: "List all sub accounts.",
          scopes: ["account:read:admin"],
          parameters: [
            { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
            { name: "page_number", in: "query", type: "integer", required: false, description: "Page number", default: 1 }
          ]
        },
        {
          method: "POST",
          path: "/accounts",
          summary: "Create sub account",
          description: "Create a sub account.",
          scopes: ["account:write:admin"],
          parameters: [],
          requestBody: {
            required: true,
            schema: {
              first_name: { type: "string", required: true, description: "First name" },
              last_name: { type: "string", required: true, description: "Last name" },
              email: { type: "string", required: true, description: "Email" },
              password: { type: "string", required: true, description: "Password" }
            },
            example: {
              first_name: "John",
              last_name: "Doe",
              email: "subaccount@example.com",
              password: "SecurePassword123!"
            }
          }
        },
        {
          method: "GET",
          path: "/accounts/{accountId}",
          summary: "Get sub account",
          description: "Get sub account details.",
          scopes: ["account:read:admin"],
          parameters: [
            { name: "accountId", in: "path", type: "string", required: true, description: "Account ID" }
          ]
        },
        {
          method: "DELETE",
          path: "/accounts/{accountId}",
          summary: "Disassociate sub account",
          description: "Disassociate a sub account from the master account.",
          scopes: ["account:write:admin"],
          parameters: [
            { name: "accountId", in: "path", type: "string", required: true, description: "Account ID" }
          ]
        },
        {
          method: "GET",
          path: "/accounts/{accountId}/settings",
          summary: "Get account settings",
          description: "Get account level settings.",
          scopes: ["account:read:admin"],
          parameters: [
            { name: "accountId", in: "path", type: "string", required: true, description: "Account ID" },
            { name: "option", in: "query", type: "string", required: false, description: "Settings option", enum: ["meeting_authentication", "recording_authentication"] }
          ]
        },
        {
          method: "PATCH",
          path: "/accounts/{accountId}/settings",
          summary: "Update account settings",
          description: "Update account level settings.",
          scopes: ["account:write:admin"],
          parameters: [
            { name: "accountId", in: "path", type: "string", required: true, description: "Account ID" }
          ],
          requestBody: {
            required: true,
            schema: {
              schedule_meeting: { type: "object", required: false, description: "Schedule meeting settings" },
              in_meeting: { type: "object", required: false, description: "In-meeting settings" },
              email_notification: { type: "object", required: false, description: "Email notification settings" }
            },
            example: {
              schedule_meeting: {
                host_video: true,
                participant_video: false
              }
            }
          }
        }
      ]
    },
    {
      name: "Groups",
      description: "Group management endpoints",
      endpoints: [
        {
          method: "GET",
          path: "/groups",
          summary: "List groups",
          description: "List all groups.",
          scopes: ["group:read:admin"],
          parameters: []
        },
        {
          method: "POST",
          path: "/groups",
          summary: "Create group",
          description: "Create a group.",
          scopes: ["group:write:admin"],
          parameters: [],
          requestBody: {
            required: true,
            schema: {
              name: { type: "string", required: true, description: "Group name" }
            },
            example: {
              name: "Engineering Team"
            }
          }
        },
        {
          method: "GET",
          path: "/groups/{groupId}",
          summary: "Get group",
          description: "Get group details.",
          scopes: ["group:read:admin"],
          parameters: [
            { name: "groupId", in: "path", type: "string", required: true, description: "Group ID" }
          ]
        },
        {
          method: "PATCH",
          path: "/groups/{groupId}",
          summary: "Update group",
          description: "Update group details.",
          scopes: ["group:write:admin"],
          parameters: [
            { name: "groupId", in: "path", type: "string", required: true, description: "Group ID" }
          ],
          requestBody: {
            required: true,
            schema: {
              name: { type: "string", required: false, description: "Group name" }
            },
            example: {
              name: "Updated Group Name"
            }
          }
        },
        {
          method: "DELETE",
          path: "/groups/{groupId}",
          summary: "Delete group",
          description: "Delete a group.",
          scopes: ["group:write:admin"],
          parameters: [
            { name: "groupId", in: "path", type: "string", required: true, description: "Group ID" }
          ]
        },
        {
          method: "GET",
          path: "/groups/{groupId}/members",
          summary: "List group members",
          description: "List members of a group.",
          scopes: ["group:read:admin"],
          parameters: [
            { name: "groupId", in: "path", type: "string", required: true, description: "Group ID" },
            { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
            { name: "page_number", in: "query", type: "integer", required: false, description: "Page number", default: 1 }
          ]
        },
        {
          method: "POST",
          path: "/groups/{groupId}/members",
          summary: "Add group members",
          description: "Add members to a group.",
          scopes: ["group:write:admin"],
          parameters: [
            { name: "groupId", in: "path", type: "string", required: true, description: "Group ID" }
          ],
          requestBody: {
            required: true,
            schema: {
              members: { type: "array", required: true, description: "Array of member objects with id or email" }
            },
            example: {
              members: [
                { id: "user-id-1" },
                { email: "user@example.com" }
              ]
            }
          }
        },
        {
          method: "DELETE",
          path: "/groups/{groupId}/members/{memberId}",
          summary: "Delete group member",
          description: "Remove a member from a group.",
          scopes: ["group:write:admin"],
          parameters: [
            { name: "groupId", in: "path", type: "string", required: true, description: "Group ID" },
            { name: "memberId", in: "path", type: "string", required: true, description: "Member ID" }
          ]
        }
      ]
    },
    {
      name: "Roles",
      description: "Role management endpoints",
      endpoints: [
        {
          method: "GET",
          path: "/roles",
          summary: "List roles",
          description: "List all roles.",
          scopes: ["role:read:admin"],
          parameters: []
        },
        {
          method: "POST",
          path: "/roles",
          summary: "Create role",
          description: "Create a new role.",
          scopes: ["role:write:admin"],
          parameters: [],
          requestBody: {
            required: true,
            schema: {
              name: { type: "string", required: true, description: "Role name" },
              description: { type: "string", required: false, description: "Role description" },
              privileges: { type: "array", required: false, description: "Array of privilege strings" }
            },
            example: {
              name: "Custom Admin",
              description: "Custom admin role with limited privileges",
              privileges: ["User:Read", "User:Edit"]
            }
          }
        },
        {
          method: "GET",
          path: "/roles/{roleId}",
          summary: "Get role information",
          description: "Get information about a specific role.",
          scopes: ["role:read:admin"],
          parameters: [
            { name: "roleId", in: "path", type: "string", required: true, description: "Role ID" }
          ]
        },
        {
          method: "PATCH",
          path: "/roles/{roleId}",
          summary: "Update role",
          description: "Update role information.",
          scopes: ["role:write:admin"],
          parameters: [
            { name: "roleId", in: "path", type: "string", required: true, description: "Role ID" }
          ],
          requestBody: {
            required: true,
            schema: {
              name: { type: "string", required: false, description: "Role name" },
              description: { type: "string", required: false, description: "Role description" },
              privileges: { type: "array", required: false, description: "Array of privileges" }
            },
            example: {
              name: "Updated Role Name"
            }
          }
        },
        {
          method: "DELETE",
          path: "/roles/{roleId}",
          summary: "Delete role",
          description: "Delete a role.",
          scopes: ["role:write:admin"],
          parameters: [
            { name: "roleId", in: "path", type: "string", required: true, description: "Role ID" }
          ]
        },
        {
          method: "GET",
          path: "/roles/{roleId}/members",
          summary: "List role members",
          description: "List all members assigned to a role.",
          scopes: ["role:read:admin"],
          parameters: [
            { name: "roleId", in: "path", type: "string", required: true, description: "Role ID" },
            { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
            { name: "page_number", in: "query", type: "integer", required: false, description: "Page number", default: 1 }
          ]
        },
        {
          method: "POST",
          path: "/roles/{roleId}/members",
          summary: "Assign role to members",
          description: "Assign a role to members.",
          scopes: ["role:write:admin"],
          parameters: [
            { name: "roleId", in: "path", type: "string", required: true, description: "Role ID" }
          ],
          requestBody: {
            required: true,
            schema: {
              members: { type: "array", required: true, description: "Array of member IDs" }
            },
            example: {
              members: ["user-id-1", "user-id-2"]
            }
          }
        },
        {
          method: "DELETE",
          path: "/roles/{roleId}/members/{memberId}",
          summary: "Unassign role from member",
          description: "Remove a role from a member.",
          scopes: ["role:write:admin"],
          parameters: [
            { name: "roleId", in: "path", type: "string", required: true, description: "Role ID" },
            { name: "memberId", in: "path", type: "string", required: true, description: "Member ID" }
          ]
        }
      ]
    },
    {
      name: "Dashboard",
      description: "Dashboard and metrics endpoints",
      endpoints: [
        {
          method: "GET",
          path: "/metrics/meetings",
          summary: "List meetings metrics",
          description: "Get metrics of live and past meetings.",
          scopes: ["dashboard_meetings:read:admin"],
          parameters: [
            { name: "type", in: "query", type: "string", required: false, description: "Meeting type", enum: ["past", "pastOne", "live"] },
            { name: "from", in: "query", type: "string", required: true, description: "Start date" },
            { name: "to", in: "query", type: "string", required: true, description: "End date" },
            { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
            { name: "next_page_token", in: "query", type: "string", required: false, description: "Next page token" }
          ]
        },
        {
          method: "GET",
          path: "/metrics/meetings/{meetingId}",
          summary: "Get meeting details metrics",
          description: "Get details on a specific meeting.",
          scopes: ["dashboard_meetings:read:admin"],
          parameters: [
            { name: "meetingId", in: "path", type: "string", required: true, description: "Meeting ID or UUID" },
            { name: "type", in: "query", type: "string", required: false, description: "Meeting type", enum: ["past", "pastOne", "live"] }
          ]
        },
        {
          method: "GET",
          path: "/metrics/meetings/{meetingId}/participants",
          summary: "Get meeting participants metrics",
          description: "Get metrics on meeting participants.",
          scopes: ["dashboard_meetings:read:admin"],
          parameters: [
            { name: "meetingId", in: "path", type: "string", required: true, description: "Meeting ID or UUID" },
            { name: "type", in: "query", type: "string", required: false, description: "Meeting type", enum: ["past", "pastOne", "live"] },
            { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
            { name: "next_page_token", in: "query", type: "string", required: false, description: "Next page token" }
          ]
        },
        {
          method: "GET",
          path: "/metrics/webinars",
          summary: "List webinars metrics",
          description: "Get metrics of live and past webinars.",
          scopes: ["dashboard_webinars:read:admin"],
          parameters: [
            { name: "type", in: "query", type: "string", required: false, description: "Webinar type", enum: ["past", "live"] },
            { name: "from", in: "query", type: "string", required: true, description: "Start date" },
            { name: "to", in: "query", type: "string", required: true, description: "End date" },
            { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
            { name: "next_page_token", in: "query", type: "string", required: false, description: "Next page token" }
          ]
        },
        {
          method: "GET",
          path: "/metrics/webinars/{webinarId}",
          summary: "Get webinar detail metrics",
          description: "Get detailed metrics for a webinar.",
          scopes: ["dashboard_webinars:read:admin"],
          parameters: [
            { name: "webinarId", in: "path", type: "string", required: true, description: "Webinar ID or UUID" },
            { name: "type", in: "query", type: "string", required: false, description: "Webinar type", enum: ["past", "live"] }
          ]
        },
        {
          method: "GET",
          path: "/metrics/zoomrooms",
          summary: "List Zoom Rooms",
          description: "Get a list of all Zoom Rooms.",
          scopes: ["dashboard_zr:read:admin"],
          parameters: [
            { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
            { name: "page_number", in: "query", type: "integer", required: false, description: "Page number", default: 1 }
          ]
        },
        {
          method: "GET",
          path: "/metrics/zoomrooms/{zoomroomId}",
          summary: "Get Zoom Room details",
          description: "Get details of a specific Zoom Room.",
          scopes: ["dashboard_zr:read:admin"],
          parameters: [
            { name: "zoomroomId", in: "path", type: "string", required: true, description: "Zoom Room ID" },
            { name: "from", in: "query", type: "string", required: true, description: "Start date" },
            { name: "to", in: "query", type: "string", required: true, description: "End date" },
            { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
            { name: "next_page_token", in: "query", type: "string", required: false, description: "Next page token" }
          ]
        }
      ]
    },
    {
      name: "Chat",
      description: "Chat messaging endpoints",
      endpoints: [
        {
          method: "GET",
          path: "/chat/users/{userId}/channels",
          summary: "List user's channels",
          description: "List all channels a user belongs to.",
          scopes: ["chat_channel:read", "chat_channel:read:admin"],
          parameters: [
            { name: "userId", in: "path", type: "string", required: true, description: "User ID or email" },
            { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 10 },
            { name: "next_page_token", in: "query", type: "string", required: false, description: "Next page token" }
          ]
        },
        {
          method: "POST",
          path: "/chat/users/{userId}/channels",
          summary: "Create channel",
          description: "Create a new channel.",
          scopes: ["chat_channel:write", "chat_channel:write:admin"],
          parameters: [
            { name: "userId", in: "path", type: "string", required: true, description: "User ID or email" }
          ],
          requestBody: {
            required: true,
            schema: {
              name: { type: "string", required: true, description: "Channel name" },
              type: { type: "integer", required: true, description: "Channel type (1: Private, 2: Private with members visible, 3: Public)", enum: [1, 2, 3] },
              members: { type: "array", required: false, description: "Array of member emails to add" }
            },
            example: {
              name: "Project Channel",
              type: 1,
              members: ["user1@example.com", "user2@example.com"]
            }
          }
        },
        {
          method: "GET",
          path: "/chat/channels/{channelId}",
          summary: "Get channel",
          description: "Get information about a channel.",
          scopes: ["chat_channel:read", "chat_channel:read:admin"],
          parameters: [
            { name: "channelId", in: "path", type: "string", required: true, description: "Channel ID" }
          ]
        },
        {
          method: "PATCH",
          path: "/chat/channels/{channelId}",
          summary: "Update channel",
          description: "Update a channel.",
          scopes: ["chat_channel:write", "chat_channel:write:admin"],
          parameters: [
            { name: "channelId", in: "path", type: "string", required: true, description: "Channel ID" }
          ],
          requestBody: {
            required: true,
            schema: {
              name: { type: "string", required: false, description: "Channel name" }
            },
            example: {
              name: "Updated Channel Name"
            }
          }
        },
        {
          method: "DELETE",
          path: "/chat/channels/{channelId}",
          summary: "Delete channel",
          description: "Delete a channel.",
          scopes: ["chat_channel:write", "chat_channel:write:admin"],
          parameters: [
            { name: "channelId", in: "path", type: "string", required: true, description: "Channel ID" }
          ]
        },
        {
          method: "GET",
          path: "/chat/channels/{channelId}/members",
          summary: "List channel members",
          description: "List members of a channel.",
          scopes: ["chat_channel:read", "chat_channel:read:admin"],
          parameters: [
            { name: "channelId", in: "path", type: "string", required: true, description: "Channel ID" },
            { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 10 },
            { name: "next_page_token", in: "query", type: "string", required: false, description: "Next page token" }
          ]
        },
        {
          method: "POST",
          path: "/chat/channels/{channelId}/members",
          summary: "Invite channel members",
          description: "Invite members to a channel.",
          scopes: ["chat_channel:write", "chat_channel:write:admin"],
          parameters: [
            { name: "channelId", in: "path", type: "string", required: true, description: "Channel ID" }
          ],
          requestBody: {
            required: true,
            schema: {
              members: { type: "array", required: true, description: "Array of member emails" }
            },
            example: {
              members: [{ email: "newmember@example.com" }]
            }
          }
        },
        {
          method: "GET",
          path: "/chat/users/{userId}/messages",
          summary: "List user's chat messages",
          description: "Get chat messages for a user.",
          scopes: ["chat_message:read", "chat_message:read:admin"],
          parameters: [
            { name: "userId", in: "path", type: "string", required: true, description: "User ID or email" },
            { name: "to_contact", in: "query", type: "string", required: false, description: "Contact's user ID or email" },
            { name: "to_channel", in: "query", type: "string", required: false, description: "Channel ID" },
            { name: "date", in: "query", type: "string", required: true, description: "Date (yyyy-mm-dd)" },
            { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 10 },
            { name: "next_page_token", in: "query", type: "string", required: false, description: "Next page token" }
          ]
        },
        {
          method: "POST",
          path: "/chat/users/{userId}/messages",
          summary: "Send chat message",
          description: "Send a chat message.",
          scopes: ["chat_message:write", "chat_message:write:admin"],
          parameters: [
            { name: "userId", in: "path", type: "string", required: true, description: "User ID or email (sender)" }
          ],
          requestBody: {
            required: true,
            schema: {
              message: { type: "string", required: true, description: "Message content" },
              to_contact: { type: "string", required: false, description: "Recipient user ID or email" },
              to_channel: { type: "string", required: false, description: "Channel ID" }
            },
            example: {
              message: "Hello, this is a test message!",
              to_contact: "recipient@example.com"
            }
          }
        }
      ]
    },
    {
      name: "Phone",
      description: "Zoom Phone endpoints",
      endpoints: [
        {
          method: "GET",
          path: "/phone/users",
          summary: "List phone users",
          description: "List all Zoom Phone users.",
          scopes: ["phone:read:admin"],
          parameters: [
            { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
            { name: "next_page_token", in: "query", type: "string", required: false, description: "Next page token" },
            { name: "site_id", in: "query", type: "string", required: false, description: "Site ID filter" }
          ]
        },
        {
          method: "GET",
          path: "/phone/users/{userId}",
          summary: "Get phone user",
          description: "Get phone user information.",
          scopes: ["phone:read:admin", "phone:read"],
          parameters: [
            { name: "userId", in: "path", type: "string", required: true, description: "User ID or email" }
          ]
        },
        {
          method: "PATCH",
          path: "/phone/users/{userId}",
          summary: "Update phone user",
          description: "Update phone user settings.",
          scopes: ["phone:write:admin"],
          parameters: [
            { name: "userId", in: "path", type: "string", required: true, description: "User ID or email" }
          ],
          requestBody: {
            required: true,
            schema: {
              extension_number: { type: "string", required: false, description: "Extension number" },
              site_id: { type: "string", required: false, description: "Site ID" }
            },
            example: {
              extension_number: "1234"
            }
          }
        },
        {
          method: "GET",
          path: "/phone/call_logs",
          summary: "Get account call logs",
          description: "Get call logs for the account.",
          scopes: ["phone:read:admin"],
          parameters: [
            { name: "from", in: "query", type: "string", required: true, description: "Start date" },
            { name: "to", in: "query", type: "string", required: true, description: "End date" },
            { name: "type", in: "query", type: "string", required: false, description: "Call type", enum: ["all", "missed"] },
            { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
            { name: "next_page_token", in: "query", type: "string", required: false, description: "Next page token" }
          ]
        },
        {
          method: "GET",
          path: "/phone/users/{userId}/call_logs",
          summary: "Get user call logs",
          description: "Get call logs for a user.",
          scopes: ["phone:read:admin", "phone:read"],
          parameters: [
            { name: "userId", in: "path", type: "string", required: true, description: "User ID or email" },
            { name: "from", in: "query", type: "string", required: true, description: "Start date" },
            { name: "to", in: "query", type: "string", required: true, description: "End date" },
            { name: "type", in: "query", type: "string", required: false, description: "Call type" },
            { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
            { name: "next_page_token", in: "query", type: "string", required: false, description: "Next page token" }
          ]
        },
        {
          method: "GET",
          path: "/phone/numbers",
          summary: "List phone numbers",
          description: "List all phone numbers in the account.",
          scopes: ["phone:read:admin"],
          parameters: [
            { name: "type", in: "query", type: "string", required: false, description: "Number type" },
            { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
            { name: "next_page_token", in: "query", type: "string", required: false, description: "Next page token" }
          ]
        },
        {
          method: "GET",
          path: "/phone/sites",
          summary: "List phone sites",
          description: "List all Zoom Phone sites.",
          scopes: ["phone:read:admin"],
          parameters: [
            { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
            { name: "next_page_token", in: "query", type: "string", required: false, description: "Next page token" }
          ]
        }
      ]
    }
  ]
};

// Export for use in popup.js
if (typeof window !== 'undefined') {
  window.ZOOM_API_SPEC = ZOOM_API_SPEC;
}
