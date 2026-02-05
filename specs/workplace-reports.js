// Zoom API - Reports & Dashboard
// Workplace > Reports/Dashboard

registerCategory("Workplace", {
  name: "Reports",
  description: "Reports and analytics endpoints",
  endpoints: [
    {
      method: "GET",
      path: "/report/daily",
      summary: "Get daily usage report",
      description: "Get daily usage report for a date range.",
      scopes: ["report:read:list_account_report:admin"],
      parameters: [
        { name: "year", in: "query", type: "integer", required: false, description: "Year (default: current year)" },
        { name: "month", in: "query", type: "integer", required: false, description: "Month (1-12, default: current month)" }
      ]
    },
    {
      method: "GET",
      path: "/report/users",
      summary: "Get active/inactive host report",
      description: "Get report of active or inactive hosts.",
      scopes: ["report:read:list_active_inactive_users:admin"],
      parameters: [
        { name: "from", in: "query", type: "string", required: true, description: "Start date (yyyy-mm-dd)" },
        { name: "to", in: "query", type: "string", required: true, description: "End date (yyyy-mm-dd)" },
        { name: "type", in: "query", type: "string", required: false, description: "User type", enum: ["active", "inactive"] },
        { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
        { name: "page_number", in: "query", type: "integer", required: false, description: "Page number", default: 1 },
        { name: "next_page_token", in: "query", type: "string", required: false, description: "Next page token" }
      ]
    },
    {
      method: "GET",
      path: "/report/users/{userId}/meetings",
      summary: "Get meeting reports",
      description: "Get meeting reports for a user.",
      scopes: ["report:read:list_user_meeting_report:admin"],
      parameters: [
        { name: "userId", in: "path", type: "string", required: true, description: "User ID or email" },
        { name: "from", in: "query", type: "string", required: true, description: "Start date (yyyy-mm-dd)" },
        { name: "to", in: "query", type: "string", required: true, description: "End date (yyyy-mm-dd)" },
        { name: "type", in: "query", type: "string", required: false, description: "Meeting type", enum: ["past", "pastOne"] },
        { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
        { name: "next_page_token", in: "query", type: "string", required: false, description: "Next page token" }
      ]
    },
    {
      method: "GET",
      path: "/report/meetings/{meetingId}",
      summary: "Get meeting detail report",
      description: "Get detailed report for a past meeting.",
      scopes: ["report:read:meeting:admin"],
      parameters: [
        { name: "meetingId", in: "path", type: "string", required: true, description: "Meeting ID or UUID" }
      ]
    },
    {
      method: "GET",
      path: "/report/meetings/{meetingId}/participants",
      summary: "Get meeting participant report",
      description: "Get participant report for a past meeting.",
      scopes: ["report:read:list_meeting_participants:admin"],
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
      scopes: ["report:read:webinar:admin"],
      parameters: [
        { name: "webinarId", in: "path", type: "string", required: true, description: "Webinar ID or UUID" }
      ]
    },
    {
      method: "GET",
      path: "/report/webinars/{webinarId}/participants",
      summary: "Get webinar participant report",
      description: "Get participant report for a past webinar.",
      scopes: ["report:read:list_webinar_participants:admin"],
      parameters: [
        { name: "webinarId", in: "path", type: "string", required: true, description: "Webinar ID or UUID" },
        { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
        { name: "next_page_token", in: "query", type: "string", required: false, description: "Next page token" }
      ]
    },
    {
      method: "GET",
      path: "/report/webinars/{webinarId}/qa",
      summary: "Get webinar Q&A report",
      description: "Get Q&A report for a past webinar.",
      scopes: ["report:read:webinar:admin"],
      parameters: [
        { name: "webinarId", in: "path", type: "string", required: true, description: "Webinar ID or UUID" }
      ]
    },
    {
      method: "GET",
      path: "/report/webinars/{webinarId}/polls",
      summary: "Get webinar poll report",
      description: "Get poll report for a past webinar.",
      scopes: ["report:read:webinar:admin"],
      parameters: [
        { name: "webinarId", in: "path", type: "string", required: true, description: "Webinar ID or UUID" }
      ]
    },
    {
      method: "GET",
      path: "/report/telephone",
      summary: "Get telephone report",
      description: "Get telephone report for a date range.",
      scopes: ["report:read:telephone:admin"],
      parameters: [
        { name: "from", in: "query", type: "string", required: true, description: "Start date" },
        { name: "to", in: "query", type: "string", required: true, description: "End date" },
        { name: "type", in: "query", type: "string", required: false, description: "Audio type", enum: ["1", "2", "3"] },
        { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
        { name: "page_number", in: "query", type: "integer", required: false, description: "Page number" }
      ]
    },
    {
      method: "GET",
      path: "/report/cloud_recording",
      summary: "Get cloud recording usage report",
      description: "Get cloud recording usage report.",
      scopes: ["report:read:cloud_recording:admin"],
      parameters: [
        { name: "from", in: "query", type: "string", required: true, description: "Start date (yyyy-mm-dd)" },
        { name: "to", in: "query", type: "string", required: true, description: "End date (yyyy-mm-dd)" }
      ]
    },
    {
      method: "GET",
      path: "/report/operationlogs",
      summary: "Get operation logs report",
      description: "Get operation logs for a date range.",
      scopes: ["report:read:operation_logs:admin"],
      parameters: [
        { name: "from", in: "query", type: "string", required: true, description: "Start date" },
        { name: "to", in: "query", type: "string", required: true, description: "End date" },
        { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
        { name: "next_page_token", in: "query", type: "string", required: false, description: "Next page token" },
        { name: "category_type", in: "query", type: "string", required: false, description: "Category type" }
      ]
    },
    {
      method: "GET",
      path: "/metrics/meetings",
      summary: "List meetings metrics",
      description: "Get metrics of live and past meetings.",
      scopes: ["dashboard:read:list_meeting_metrics:admin"],
      parameters: [
        { name: "type", in: "query", type: "string", required: false, description: "Meeting type", enum: ["past", "pastOne", "live"] },
        { name: "from", in: "query", type: "string", required: true, description: "Start date (yyyy-mm-dd)" },
        { name: "to", in: "query", type: "string", required: true, description: "End date (yyyy-mm-dd)" },
        { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
        { name: "next_page_token", in: "query", type: "string", required: false, description: "Next page token" }
      ]
    },
    {
      method: "GET",
      path: "/metrics/meetings/{meetingId}",
      summary: "Get meeting details metrics",
      description: "Get details on a specific meeting.",
      scopes: ["dashboard:read:meeting:admin"],
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
      scopes: ["dashboard:read:list_meeting_participants:admin"],
      parameters: [
        { name: "meetingId", in: "path", type: "string", required: true, description: "Meeting ID or UUID" },
        { name: "type", in: "query", type: "string", required: false, description: "Meeting type", enum: ["past", "pastOne", "live"] },
        { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
        { name: "next_page_token", in: "query", type: "string", required: false, description: "Next page token" },
        { name: "include_fields", in: "query", type: "string", required: false, description: "Include fields", enum: ["registrant_id"] }
      ]
    },
    {
      method: "GET",
      path: "/metrics/webinars",
      summary: "List webinars metrics",
      description: "Get metrics of live and past webinars.",
      scopes: ["dashboard:read:list_webinar_metrics:admin"],
      parameters: [
        { name: "type", in: "query", type: "string", required: false, description: "Webinar type", enum: ["past", "live"] },
        { name: "from", in: "query", type: "string", required: true, description: "Start date (yyyy-mm-dd)" },
        { name: "to", in: "query", type: "string", required: true, description: "End date (yyyy-mm-dd)" },
        { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
        { name: "next_page_token", in: "query", type: "string", required: false, description: "Next page token" }
      ]
    },
    {
      method: "GET",
      path: "/metrics/zoomrooms",
      summary: "List Zoom Rooms",
      description: "Get a list of all Zoom Rooms.",
      scopes: ["dashboard:read:list_zoom_rooms:admin"],
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
      scopes: ["dashboard:read:zoom_room:admin"],
      parameters: [
        { name: "zoomroomId", in: "path", type: "string", required: true, description: "Zoom Room ID" },
        { name: "from", in: "query", type: "string", required: true, description: "Start date" },
        { name: "to", in: "query", type: "string", required: true, description: "End date" },
        { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
        { name: "next_page_token", in: "query", type: "string", required: false, description: "Next page token" }
      ]
    }
  ]
});
