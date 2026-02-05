// Zoom API - Accounts
// Accounts > Accounts

registerCategory("Accounts", {
  name: "Accounts",
  description: "Account management endpoints",
  endpoints: [
    {
      method: "GET",
      path: "/accounts",
      summary: "List sub accounts",
      description: "List all sub accounts.",
      scopes: ["account:read:list_sub_accounts:admin"],
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
      scopes: ["account:write:account:admin"],
      parameters: [],
      requestBody: {
        required: true,
        schema: {
          first_name: { type: "string", required: true, description: "Admin first name" },
          last_name: { type: "string", required: true, description: "Admin last name" },
          email: { type: "string", required: true, description: "Admin email" },
          password: { type: "string", required: true, description: "Admin password" },
          options: { type: "object", required: false, description: "Account options" }
        },
        example: {
          first_name: "John",
          last_name: "Doe",
          email: "subaccount@example.com",
          password: "SecurePassword123!",
          options: {
            share_rc: true,
            room_connectors: "us01",
            share_mc: true,
            meeting_connectors: "us01"
          }
        }
      }
    },
    {
      method: "GET",
      path: "/accounts/{accountId}",
      summary: "Get sub account",
      description: "Get sub account details.",
      scopes: ["account:read:account:admin"],
      parameters: [
        { name: "accountId", in: "path", type: "string", required: true, description: "Account ID" }
      ]
    },
    {
      method: "DELETE",
      path: "/accounts/{accountId}",
      summary: "Disassociate sub account",
      description: "Disassociate a sub account from the master account.",
      scopes: ["account:write:account:admin"],
      parameters: [
        { name: "accountId", in: "path", type: "string", required: true, description: "Account ID" }
      ]
    },
    {
      method: "GET",
      path: "/accounts/{accountId}/options",
      summary: "Get account options",
      description: "Get account options for a sub account.",
      scopes: ["account:read:options:admin"],
      parameters: [
        { name: "accountId", in: "path", type: "string", required: true, description: "Account ID" }
      ]
    },
    {
      method: "PATCH",
      path: "/accounts/{accountId}/options",
      summary: "Update account options",
      description: "Update account options for a sub account.",
      scopes: ["account:write:options:admin"],
      parameters: [
        { name: "accountId", in: "path", type: "string", required: true, description: "Account ID" }
      ],
      requestBody: {
        required: true,
        schema: {
          share_rc: { type: "boolean", required: false, description: "Share virtual room connector" },
          room_connectors: { type: "string", required: false, description: "Room connectors" },
          share_mc: { type: "boolean", required: false, description: "Share meeting connector" },
          meeting_connectors: { type: "string", required: false, description: "Meeting connectors" },
          pay_mode: { type: "string", required: false, description: "Payment mode", enum: ["master", "sub"] }
        },
        example: {
          share_rc: true,
          share_mc: true,
          pay_mode: "master"
        }
      }
    },
    {
      method: "GET",
      path: "/accounts/{accountId}/settings",
      summary: "Get account settings",
      description: "Get account level settings.",
      scopes: ["account:read:settings:admin"],
      parameters: [
        { name: "accountId", in: "path", type: "string", required: true, description: "Account ID" },
        { name: "option", in: "query", type: "string", required: false, description: "Settings option", enum: ["meeting_authentication", "recording_authentication", "security", "meeting_security"] }
      ]
    },
    {
      method: "PATCH",
      path: "/accounts/{accountId}/settings",
      summary: "Update account settings",
      description: "Update account level settings.",
      scopes: ["account:write:settings:admin"],
      parameters: [
        { name: "accountId", in: "path", type: "string", required: true, description: "Account ID" },
        { name: "option", in: "query", type: "string", required: false, description: "Settings option" }
      ],
      requestBody: {
        required: true,
        schema: {
          schedule_meeting: { type: "object", required: false, description: "Schedule meeting settings" },
          in_meeting: { type: "object", required: false, description: "In-meeting settings" },
          email_notification: { type: "object", required: false, description: "Email notification settings" },
          recording: { type: "object", required: false, description: "Recording settings" },
          telephony: { type: "object", required: false, description: "Telephony settings" },
          integration: { type: "object", required: false, description: "Integration settings" },
          feature: { type: "object", required: false, description: "Feature settings" }
        },
        example: {
          schedule_meeting: {
            host_video: true,
            participant_video: false,
            join_before_host: false
          },
          recording: {
            cloud_recording: true,
            auto_recording: "local"
          }
        }
      }
    },
    {
      method: "GET",
      path: "/accounts/{accountId}/lock_settings",
      summary: "Get locked settings",
      description: "Get locked account settings.",
      scopes: ["account:read:settings:admin"],
      parameters: [
        { name: "accountId", in: "path", type: "string", required: true, description: "Account ID" },
        { name: "option", in: "query", type: "string", required: false, description: "Settings option" }
      ]
    },
    {
      method: "PATCH",
      path: "/accounts/{accountId}/lock_settings",
      summary: "Update locked settings",
      description: "Update locked account settings.",
      scopes: ["account:write:settings:admin"],
      parameters: [
        { name: "accountId", in: "path", type: "string", required: true, description: "Account ID" },
        { name: "option", in: "query", type: "string", required: false, description: "Settings option" }
      ],
      requestBody: {
        required: true,
        schema: {
          schedule_meeting: { type: "object", required: false, description: "Schedule meeting lock settings" },
          in_meeting: { type: "object", required: false, description: "In-meeting lock settings" },
          recording: { type: "object", required: false, description: "Recording lock settings" }
        },
        example: {
          schedule_meeting: {
            host_video: true,
            participant_video: true
          }
        }
      }
    },
    {
      method: "GET",
      path: "/accounts/{accountId}/managed_domains",
      summary: "Get managed domains",
      description: "Get account's managed domains.",
      scopes: ["account:read:managed_domains:admin"],
      parameters: [
        { name: "accountId", in: "path", type: "string", required: true, description: "Account ID" }
      ]
    },
    {
      method: "GET",
      path: "/accounts/{accountId}/trusted_domains",
      summary: "Get trusted domains",
      description: "Get account's trusted domains.",
      scopes: ["account:read:trusted_domains:admin"],
      parameters: [
        { name: "accountId", in: "path", type: "string", required: true, description: "Account ID" }
      ]
    }
  ]
});
