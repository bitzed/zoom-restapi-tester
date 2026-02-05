// Zoom API - Phone
// Workplace > Phone

registerCategory("Workplace", {
  name: "Phone",
  description: "Zoom Phone endpoints",
  endpoints: [
    {
      method: "GET",
      path: "/phone/users",
      summary: "List phone users",
      description: "List all Zoom Phone users.",
      scopes: ["phone:read:list_users:admin"],
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
      scopes: ["phone:read:user:admin"],
      parameters: [
        { name: "userId", in: "path", type: "string", required: true, description: "User ID or email" }
      ]
    },
    {
      method: "PATCH",
      path: "/phone/users/{userId}",
      summary: "Update phone user",
      description: "Update phone user settings.",
      scopes: ["phone:write:user:admin"],
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
      scopes: ["phone:read:list_call_logs:admin"],
      parameters: [
        { name: "from", in: "query", type: "string", required: true, description: "Start date (yyyy-mm-dd)" },
        { name: "to", in: "query", type: "string", required: true, description: "End date (yyyy-mm-dd)" },
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
      scopes: ["phone:read:list_user_call_logs:admin"],
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
      scopes: ["phone:read:list_numbers:admin"],
      parameters: [
        { name: "type", in: "query", type: "string", required: false, description: "Number type", enum: ["assigned", "unassigned", "all"] },
        { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
        { name: "next_page_token", in: "query", type: "string", required: false, description: "Next page token" }
      ]
    },
    {
      method: "GET",
      path: "/phone/sites",
      summary: "List phone sites",
      description: "List all Zoom Phone sites.",
      scopes: ["phone:read:list_sites:admin"],
      parameters: [
        { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
        { name: "next_page_token", in: "query", type: "string", required: false, description: "Next page token" }
      ]
    },
    {
      method: "GET",
      path: "/phone/sites/{siteId}",
      summary: "Get phone site",
      description: "Get a specific Zoom Phone site.",
      scopes: ["phone:read:site:admin"],
      parameters: [
        { name: "siteId", in: "path", type: "string", required: true, description: "Site ID" }
      ]
    },
    {
      method: "POST",
      path: "/phone/sites",
      summary: "Create phone site",
      description: "Create a new Zoom Phone site.",
      scopes: ["phone:write:site:admin"],
      parameters: [],
      requestBody: {
        required: true,
        schema: {
          name: { type: "string", required: true, description: "Site name" },
          country: { type: "string", required: true, description: "Country code" },
          site_code: { type: "string", required: false, description: "Site code" }
        },
        example: {
          name: "San Francisco Office",
          country: "US",
          site_code: "SF01"
        }
      }
    },
    {
      method: "GET",
      path: "/phone/call_queues",
      summary: "List call queues",
      description: "List all call queues.",
      scopes: ["phone:read:list_call_queues:admin"],
      parameters: [
        { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
        { name: "next_page_token", in: "query", type: "string", required: false, description: "Next page token" }
      ]
    },
    {
      method: "GET",
      path: "/phone/call_queues/{callQueueId}",
      summary: "Get call queue",
      description: "Get a specific call queue.",
      scopes: ["phone:read:call_queue:admin"],
      parameters: [
        { name: "callQueueId", in: "path", type: "string", required: true, description: "Call Queue ID" }
      ]
    },
    {
      method: "GET",
      path: "/phone/auto_receptionists",
      summary: "List auto receptionists",
      description: "List all auto receptionists.",
      scopes: ["phone:read:list_auto_receptionists:admin"],
      parameters: [
        { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
        { name: "next_page_token", in: "query", type: "string", required: false, description: "Next page token" }
      ]
    },
    {
      method: "GET",
      path: "/phone/common_areas",
      summary: "List common area phones",
      description: "List all common area phones.",
      scopes: ["phone:read:list_common_areas:admin"],
      parameters: [
        { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
        { name: "next_page_token", in: "query", type: "string", required: false, description: "Next page token" }
      ]
    },
    {
      method: "GET",
      path: "/phone/users/{userId}/voicemails",
      summary: "List user voicemails",
      description: "List voicemails for a user.",
      scopes: ["phone:read:list_voicemails:admin"],
      parameters: [
        { name: "userId", in: "path", type: "string", required: true, description: "User ID or email" },
        { name: "status", in: "query", type: "string", required: false, description: "Voicemail status", enum: ["all", "read", "unread"] },
        { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
        { name: "next_page_token", in: "query", type: "string", required: false, description: "Next page token" }
      ]
    },
    {
      method: "GET",
      path: "/phone/users/{userId}/recordings",
      summary: "List user call recordings",
      description: "List call recordings for a user.",
      scopes: ["phone:read:list_recordings:admin"],
      parameters: [
        { name: "userId", in: "path", type: "string", required: true, description: "User ID or email" },
        { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 30 },
        { name: "next_page_token", in: "query", type: "string", required: false, description: "Next page token" }
      ]
    }
  ]
});
