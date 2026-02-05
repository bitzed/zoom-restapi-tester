// Zoom API - Users
// Accounts > Users

registerCategory("Accounts", {
  name: "Users",
  description: "User management endpoints",
  endpoints: [
    {
      method: "GET",
      path: "/users",
      summary: "List users",
      description: "List all users on your Zoom account.",
      scopes: ["user:read:list_users:admin"],
      parameters: [
        { name: "status", in: "query", type: "string", required: false, description: "Filter by user status", enum: ["active", "inactive", "pending"] },
        { name: "page_size", in: "query", type: "integer", required: false, description: "Number of records per page (max 300)", default: 30 },
        { name: "page_number", in: "query", type: "integer", required: false, description: "Page number", default: 1 },
        { name: "role_id", in: "query", type: "string", required: false, description: "Filter by role ID" },
        { name: "include_fields", in: "query", type: "string", required: false, description: "Include additional fields", enum: ["custom_attributes", "host_key"] }
      ]
    },
    {
      method: "POST",
      path: "/users",
      summary: "Create user",
      description: "Create a new user on your Zoom account.",
      scopes: ["user:write:user:admin"],
      parameters: [],
      requestBody: {
        required: true,
        schema: {
          action: { type: "string", required: true, description: "Action to take", enum: ["create", "autoCreate", "custCreate", "ssoCreate"] },
          user_info: {
            type: "object",
            properties: {
              email: { type: "string", required: true, description: "User email address" },
              type: { type: "integer", required: true, description: "User type (1: Basic, 2: Licensed, 3: On-prem)", enum: [1, 2, 3] },
              first_name: { type: "string", required: false, description: "First name" },
              last_name: { type: "string", required: false, description: "Last name" },
              password: { type: "string", required: false, description: "Password (for create action)" }
            }
          }
        },
        example: {
          action: "create",
          user_info: {
            email: "user@example.com",
            type: 2,
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
      scopes: ["user:read:user:admin"],
      parameters: [
        { name: "userId", in: "path", type: "string", required: true, description: "User ID or email address. Use 'me' for current user." },
        { name: "login_type", in: "query", type: "integer", required: false, description: "Login type", enum: [0, 1, 99, 100, 101] },
        { name: "encrypted_email", in: "query", type: "boolean", required: false, description: "Return encrypted email" }
      ]
    },
    {
      method: "PATCH",
      path: "/users/{userId}",
      summary: "Update user",
      description: "Update a user's profile information.",
      scopes: ["user:write:user:admin"],
      parameters: [
        { name: "userId", in: "path", type: "string", required: true, description: "User ID or email address" },
        { name: "login_type", in: "query", type: "integer", required: false, description: "Login type" }
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
          company: { type: "string", required: false, description: "Company name" },
          language: { type: "string", required: false, description: "Language" },
          phone_number: { type: "string", required: false, description: "Phone number" },
          vanity_name: { type: "string", required: false, description: "Personal link name" }
        },
        example: {
          first_name: "John",
          last_name: "Doe",
          dept: "Engineering",
          job_title: "Software Engineer"
        }
      }
    },
    {
      method: "DELETE",
      path: "/users/{userId}",
      summary: "Delete user",
      description: "Delete a user from your Zoom account.",
      scopes: ["user:write:user:admin"],
      parameters: [
        { name: "userId", in: "path", type: "string", required: true, description: "User ID or email address" },
        { name: "action", in: "query", type: "string", required: false, description: "Delete action", enum: ["delete", "disassociate"] },
        { name: "transfer_email", in: "query", type: "string", required: false, description: "Email to transfer data to" },
        { name: "transfer_meeting", in: "query", type: "boolean", required: false, description: "Transfer meetings" },
        { name: "transfer_webinar", in: "query", type: "boolean", required: false, description: "Transfer webinars" },
        { name: "transfer_recording", in: "query", type: "boolean", required: false, description: "Transfer recordings" }
      ]
    },
    {
      method: "GET",
      path: "/users/{userId}/settings",
      summary: "Get user settings",
      description: "Retrieve a user's settings.",
      scopes: ["user:read:settings:admin"],
      parameters: [
        { name: "userId", in: "path", type: "string", required: true, description: "User ID or email address" },
        { name: "login_type", in: "query", type: "integer", required: false, description: "Login type" },
        { name: "option", in: "query", type: "string", required: false, description: "Settings option", enum: ["meeting_authentication", "recording_authentication", "meeting_security"] },
        { name: "custom_query_fields", in: "query", type: "string", required: false, description: "Custom query fields" }
      ]
    },
    {
      method: "PATCH",
      path: "/users/{userId}/settings",
      summary: "Update user settings",
      description: "Update a user's settings.",
      scopes: ["user:write:settings:admin"],
      parameters: [
        { name: "userId", in: "path", type: "string", required: true, description: "User ID or email address" },
        { name: "option", in: "query", type: "string", required: false, description: "Settings option" }
      ],
      requestBody: {
        required: true,
        schema: {
          schedule_meeting: { type: "object", required: false, description: "Schedule meeting settings" },
          in_meeting: { type: "object", required: false, description: "In-meeting settings" },
          email_notification: { type: "object", required: false, description: "Email notification settings" },
          recording: { type: "object", required: false, description: "Recording settings" },
          feature: { type: "object", required: false, description: "Feature settings" }
        },
        example: {
          schedule_meeting: {
            host_video: true,
            participants_video: true,
            join_before_host: false
          },
          in_meeting: {
            e2e_encryption: true
          }
        }
      }
    },
    {
      method: "PUT",
      path: "/users/{userId}/status",
      summary: "Update user status",
      description: "Activate or deactivate a user.",
      scopes: ["user:write:user:admin"],
      parameters: [
        { name: "userId", in: "path", type: "string", required: true, description: "User ID or email" }
      ],
      requestBody: {
        required: true,
        schema: {
          action: { type: "string", required: true, description: "Action", enum: ["activate", "deactivate"] }
        },
        example: {
          action: "activate"
        }
      }
    },
    {
      method: "PUT",
      path: "/users/{userId}/password",
      summary: "Update user password",
      description: "Update a user's password.",
      scopes: ["user:write:user:admin"],
      parameters: [
        { name: "userId", in: "path", type: "string", required: true, description: "User ID or email" }
      ],
      requestBody: {
        required: true,
        schema: {
          password: { type: "string", required: true, description: "New password" }
        },
        example: {
          password: "NewSecurePassword123!"
        }
      }
    },
    {
      method: "GET",
      path: "/users/{userId}/permissions",
      summary: "Get user permissions",
      description: "Get permissions assigned to a user.",
      scopes: ["user:read:permissions:admin"],
      parameters: [
        { name: "userId", in: "path", type: "string", required: true, description: "User ID or email" }
      ]
    },
    {
      method: "GET",
      path: "/users/{userId}/token",
      summary: "Get user token",
      description: "Get a user's Zoom token.",
      scopes: ["user:read:token:admin"],
      parameters: [
        { name: "userId", in: "path", type: "string", required: true, description: "User ID or email" },
        { name: "type", in: "query", type: "string", required: false, description: "Token type", enum: ["token", "zak", "zpk"] },
        { name: "ttl", in: "query", type: "integer", required: false, description: "Token time-to-live" }
      ]
    },
    {
      method: "DELETE",
      path: "/users/{userId}/token",
      summary: "Revoke user SSO token",
      description: "Revoke a user's SSO token.",
      scopes: ["user:write:token:admin"],
      parameters: [
        { name: "userId", in: "path", type: "string", required: true, description: "User ID or email" }
      ]
    },
    {
      method: "GET",
      path: "/users/{userId}/assistants",
      summary: "List user assistants",
      description: "List user's scheduling assistants.",
      scopes: ["user:read:list_assistants:admin"],
      parameters: [
        { name: "userId", in: "path", type: "string", required: true, description: "User ID or email" }
      ]
    },
    {
      method: "POST",
      path: "/users/{userId}/assistants",
      summary: "Add user assistants",
      description: "Add scheduling assistants to a user.",
      scopes: ["user:write:assistant:admin"],
      parameters: [
        { name: "userId", in: "path", type: "string", required: true, description: "User ID or email" }
      ],
      requestBody: {
        required: true,
        schema: {
          assistants: { type: "array", required: true, description: "Array of assistant objects" }
        },
        example: {
          assistants: [
            { id: "assistant-user-id" },
            { email: "assistant@example.com" }
          ]
        }
      }
    }
  ]
});
