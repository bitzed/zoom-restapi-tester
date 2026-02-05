// Zoom API - Groups
// Accounts > Groups

registerCategory("Accounts", {
  name: "Groups",
  description: "Group management endpoints",
  endpoints: [
    {
      method: "GET",
      path: "/groups",
      summary: "List groups",
      description: "List all groups.",
      scopes: ["group:read:list_groups:admin"],
      parameters: []
    },
    {
      method: "POST",
      path: "/groups",
      summary: "Create group",
      description: "Create a group.",
      scopes: ["group:write:group:admin"],
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
      scopes: ["group:read:group:admin"],
      parameters: [
        { name: "groupId", in: "path", type: "string", required: true, description: "Group ID" }
      ]
    },
    {
      method: "PATCH",
      path: "/groups/{groupId}",
      summary: "Update group",
      description: "Update group details.",
      scopes: ["group:write:group:admin"],
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
      scopes: ["group:write:group:admin"],
      parameters: [
        { name: "groupId", in: "path", type: "string", required: true, description: "Group ID" }
      ]
    },
    {
      method: "GET",
      path: "/groups/{groupId}/members",
      summary: "List group members",
      description: "List members of a group.",
      scopes: ["group:read:list_members:admin"],
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
      scopes: ["group:write:member:admin"],
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
      scopes: ["group:write:member:admin"],
      parameters: [
        { name: "groupId", in: "path", type: "string", required: true, description: "Group ID" },
        { name: "memberId", in: "path", type: "string", required: true, description: "Member ID" }
      ]
    },
    {
      method: "GET",
      path: "/groups/{groupId}/settings",
      summary: "Get group settings",
      description: "Get settings for a group.",
      scopes: ["group:read:settings:admin"],
      parameters: [
        { name: "groupId", in: "path", type: "string", required: true, description: "Group ID" },
        { name: "option", in: "query", type: "string", required: false, description: "Settings option", enum: ["meeting_authentication", "recording_authentication"] }
      ]
    },
    {
      method: "PATCH",
      path: "/groups/{groupId}/settings",
      summary: "Update group settings",
      description: "Update settings for a group.",
      scopes: ["group:write:settings:admin"],
      parameters: [
        { name: "groupId", in: "path", type: "string", required: true, description: "Group ID" },
        { name: "option", in: "query", type: "string", required: false, description: "Settings option" }
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
            participant_video: false
          }
        }
      }
    },
    {
      method: "GET",
      path: "/groups/{groupId}/lock_settings",
      summary: "Get group lock settings",
      description: "Get locked settings for a group.",
      scopes: ["group:read:settings:admin"],
      parameters: [
        { name: "groupId", in: "path", type: "string", required: true, description: "Group ID" }
      ]
    },
    {
      method: "PATCH",
      path: "/groups/{groupId}/lock_settings",
      summary: "Update group lock settings",
      description: "Update locked settings for a group.",
      scopes: ["group:write:settings:admin"],
      parameters: [
        { name: "groupId", in: "path", type: "string", required: true, description: "Group ID" }
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
            host_video: true
          }
        }
      }
    }
  ]
});
