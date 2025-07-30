import React, { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import { useFlowContext } from "../store/FlowContext";

interface Permissions {
  authRequired: boolean;
  routes: string[];
  canCreateUsers: boolean;
  canEditUsers: boolean;
  canDeleteUsers: boolean;
  canManageRoles: boolean;
  canLogin: boolean;
  canRegister: boolean;
  canGoogleLogin: boolean;
  canAppleLogin: boolean;
  canMicrosoftLogin: boolean;
  canMagicLinkLogin: boolean;
  needs2FA: boolean;
  canSetPermissions: boolean;
}

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: {
    id: string;
    name: string;
    slug: string;
    permissions: Permissions;
  };
}

const createInitialFormData = () => ({
  id: `role_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  name: "",
  slug: "",
  permissions: {
    authRequired: false,
    routes: [],
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canManageRoles: false,
    canLogin: false,
    canRegister: false,
    canGoogleLogin: false,
    canAppleLogin: false,
    canMicrosoftLogin: false,
    canMagicLinkLogin: false,
    needs2FA: false,
    canSetPermissions: false,
  },
});

export function RoleModal({ isOpen, onClose, role }: RoleModalProps) {
  const { routes, addRole, updateRole, deleteRole } = useFlowContext();
  const [formData, setFormData] = useState(createInitialFormData());

  useEffect(() => {
    if (role) {
      setFormData(role);
    } else {
      setFormData(createInitialFormData());
    }
  }, [role, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      if (name.startsWith("permissions.")) {
        const permissionKey = name.split(".")[1];
        setFormData({
          ...formData,
          permissions: {
            ...formData.permissions,
            [permissionKey]: checked,
          },
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
        ...(name === "name" && !role
          ? {
              slug: value
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "-")
                .replace(/-+/g, "-")
                .replace(/^-|-$/g, ""),
            }
          : {}),
      });
    }
  };

  const handleRouteChange = (routeId: string, checked: boolean) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        routes: checked
          ? [...formData.permissions.routes, routeId]
          : formData.permissions.routes.filter((id) => id !== routeId),
      },
    });
  };

  const handleSelectAllRoutes = (checked: boolean) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        routes: checked ? routes.map((route) => route.id) : [],
      },
    });
  };

  const handleSave = () => {
    if (role) {
      updateRole(formData);
    } else {
      addRole(formData);
    }
    onClose();
  };

  const handleDelete = () => {
    if (role) {
      deleteRole(role.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {role ? "Edit Role" : "Add New Role"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Role Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Enter role name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Role Slug
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="role-slug"
                readOnly={!!role}
              />
            </div>

            <div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Permissions</h4>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={
                          formData.permissions.routes.length > 0 &&
                          formData.permissions.routes.length === routes.length
                        }
                        onChange={(e) =>
                          handleSelectAllRoutes(e.target.checked)
                        }
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm">Select All</span>
                    </label>
                  </div>
                  <div className="max-h-40 overflow-y-auto border rounded p-2 space-y-2">
                    {routes.map((route) => (
                      <label key={route.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.permissions.routes.includes(
                            route.id
                          )}
                          onChange={(e) =>
                            handleRouteChange(route.id, e.target.checked)
                          }
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm">
                          {route.name} ({route.method} {route.url})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">User Management</h4>
                  <div className="space-y-2 ml-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="permissions.canCreateUsers"
                        checked={formData.permissions.canCreateUsers}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm">Can Create Users</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="permissions.canEditUsers"
                        checked={formData.permissions.canEditUsers}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm">Can Edit Users</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="permissions.canDeleteUsers"
                        checked={formData.permissions.canDeleteUsers}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm">Can Delete Users</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">
                    Authentication Management
                  </h4>
                  <div className="space-y-2 ml-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="permissions.authRequired"
                        checked={formData.permissions.authRequired}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm">
                        Authentication Required
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="permissions.canLogin"
                        checked={formData.permissions.canLogin}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm">Can Login</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="permissions.canRegister"
                        checked={formData.permissions.canRegister}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm">Can Register</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="permissions.canGoogleLogin"
                        checked={formData.permissions.canGoogleLogin}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm">Can Use Google Login</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="permissions.needs2FA"
                        checked={formData.permissions.needs2FA}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm">Requires 2FA</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="permissions.canSetPermissions"
                        checked={formData.permissions.canSetPermissions}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm">Can Set Permissions</span>
                    </label>
                  </div>
                </div>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="permissions.canManageRoles"
                    checked={formData.permissions.canManageRoles}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm">Can Manage Roles</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-between">
          {role && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Role
            </button>
          )}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {role ? "Update" : "Save"} Role
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
