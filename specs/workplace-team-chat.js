// Zoom API - Team Chat
// Workplace > Team Chat

registerCategory("Workplace", {
  name: "Team Chat",
  description: "Team Chat messaging endpoints",
  endpoints: [
    {
      method: "GET",
      path: "/chat/users/{userId}/channels",
      summary: "List user's channels",
      description: "List all channels a user belongs to.",
      scopes: ["team_chat:read:list_user_channels:admin"],
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
      scopes: ["team_chat:write:channel:admin"],
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
      scopes: ["team_chat:read:channel:admin"],
      parameters: [
        { name: "channelId", in: "path", type: "string", required: true, description: "Channel ID" }
      ]
    },
    {
      method: "PATCH",
      path: "/chat/channels/{channelId}",
      summary: "Update channel",
      description: "Update a channel.",
      scopes: ["team_chat:write:channel:admin"],
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
      scopes: ["team_chat:write:channel:admin"],
      parameters: [
        { name: "channelId", in: "path", type: "string", required: true, description: "Channel ID" }
      ]
    },
    {
      method: "GET",
      path: "/chat/channels/{channelId}/members",
      summary: "List channel members",
      description: "List members of a channel.",
      scopes: ["team_chat:read:list_members:admin"],
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
      scopes: ["team_chat:write:member:admin"],
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
      method: "DELETE",
      path: "/chat/channels/{channelId}/members/{memberId}",
      summary: "Remove channel member",
      description: "Remove a member from a channel.",
      scopes: ["team_chat:write:member:admin"],
      parameters: [
        { name: "channelId", in: "path", type: "string", required: true, description: "Channel ID" },
        { name: "memberId", in: "path", type: "string", required: true, description: "Member ID" }
      ]
    },
    {
      method: "GET",
      path: "/chat/users/{userId}/messages",
      summary: "List user's chat messages",
      description: "Get chat messages for a user.",
      scopes: ["team_chat:read:list_user_messages:admin"],
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
      scopes: ["team_chat:write:message:admin"],
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
    },
    {
      method: "PUT",
      path: "/chat/users/{userId}/messages/{messageId}",
      summary: "Update chat message",
      description: "Update a chat message.",
      scopes: ["team_chat:write:message:admin"],
      parameters: [
        { name: "userId", in: "path", type: "string", required: true, description: "User ID or email" },
        { name: "messageId", in: "path", type: "string", required: true, description: "Message ID" }
      ],
      requestBody: {
        required: true,
        schema: {
          message: { type: "string", required: true, description: "Updated message content" }
        },
        example: {
          message: "Updated message content"
        }
      }
    },
    {
      method: "DELETE",
      path: "/chat/users/{userId}/messages/{messageId}",
      summary: "Delete chat message",
      description: "Delete a chat message.",
      scopes: ["team_chat:write:message:admin"],
      parameters: [
        { name: "userId", in: "path", type: "string", required: true, description: "User ID or email" },
        { name: "messageId", in: "path", type: "string", required: true, description: "Message ID" },
        { name: "to_contact", in: "query", type: "string", required: false, description: "Contact's user ID" },
        { name: "to_channel", in: "query", type: "string", required: false, description: "Channel ID" }
      ]
    },
    {
      method: "GET",
      path: "/chat/users/me/contacts",
      summary: "List user contacts",
      description: "List all contacts of the current user.",
      scopes: ["team_chat:read:list_contacts:admin"],
      parameters: [
        { name: "type", in: "query", type: "string", required: false, description: "Contact type", enum: ["internal", "external"] },
        { name: "page_size", in: "query", type: "integer", required: false, description: "Page size", default: 10 },
        { name: "next_page_token", in: "query", type: "string", required: false, description: "Next page token" }
      ]
    }
  ]
});
