// Zoom API - Roles
// Accounts > Roles

registerCategory("Accounts", {
  name: "Roles",
  description: "Role management endpoints",
  endpoints: [
    {
      method: "GET",
      path: "/roles",
      summary: "List roles",
      description: "List all roles.",
      scopes: ["role:read:list_roles:admin"],
      parameters: []
    },
    {
      method: "POST",
      path: "/roles",
      summary: "Create role",
      description: "Create a new role.",
      scopes: ["role:write:role:admin"],
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
          privileges: ["User:Read", "User:Edit", "Meeting:Read", "Meeting:Edit"]
        }
      }
    },
    {
      method: "GET",
      path: "/roles/{roleId}",
      summary: "Get role information",
      description: "Get information about a specific role.",
      scopes: ["role:read:role:admin"],
      parameters: [
        { name: "roleId", in: "path", type: "string", required: true, description: "Role ID" }
      ]
    },
    {
      method: "PATCH",
      path: "/roles/{roleId}",
      summary: "Update role",
      description: "Update role information.",
      scopes: ["role:write:role:admin"],
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
          name: "Updated Role Name",
          description: "Updated description"
        }
      }
    },
    {
      method: "DELETE",
      path: "/roles/{roleId}",
      summary: "Delete role",
      description: "Delete a role.",
      scopes: ["role:write:role:admin"],
      parameters: [
        { name: "roleId", in: "path", type: "string", required: true, description: "Role ID" }
      ]
    },
    {
      method: "GET",
      path: "/roles/{roleId}/members",
      summary: "List role members",
      description: "List all members assigned to a role.",
      scopes: ["role:read:list_members:admin"],
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
      scopes: ["role:write:member:admin"],
      parameters: [
        { name: "roleId", in: "path", type: "string", required: true, description: "Role ID" }
      ],
      requestBody: {
        required: true,
        schema: {
          members: { type: "array", required: true, description: "Array of member IDs or emails" }
        },
        example: {
          members: [
            { id: "user-id-1" },
            { id: "user-id-2" }
          ]
        }
      }
    },
    {
      method: "DELETE",
      path: "/roles/{roleId}/members/{memberId}",
      summary: "Unassign role from member",
      description: "Remove a role from a member.",
      scopes: ["role:write:member:admin"],
      parameters: [
        { name: "roleId", in: "path", type: "string", required: true, description: "Role ID" },
        { name: "memberId", in: "path", type: "string", required: true, description: "Member ID" }
      ]
    }
  ]
});
