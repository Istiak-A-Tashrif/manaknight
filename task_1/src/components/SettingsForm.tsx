import React from "react";
import { Save } from "lucide-react";
import { useFlowContext } from "../store/FlowContext";
import { TranslationService } from "../services/TranslationService";

export function SettingsForm() {
  const { settings, updateSettings, routes, models, roles } = useFlowContext();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    updateSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    updateSettings(settings);
  };

  const handleExportConfiguration = () => {
    const configuration = {
      models: models.map((model: any) => TranslationService.translateModel(model)),
      roles: roles.map((role: any) => ({
        name: role.name,
        slug: role.slug,
        permissions: {
          authRequired: role.permissions.authRequired,
          routes: role.permissions.routes
            .map((routeId: any) => {
              const route = routes.find((r: any) => r.id === routeId);
              return route ? route.name : null;
            })
            .filter(Boolean),
          canCreateUsers: role.permissions.canCreateUsers,
          canEditUsers: role.permissions.canEditUsers,
          canDeleteUsers: role.permissions.canDeleteUsers,
          canManageRoles: role.permissions.canManageRoles,
        },
      })),
      routes: routes.map((route: any) => TranslationService.translateRoute(route)),
      settings: {
        globalKey: settings.globalKey,
        databaseType: settings.databaseType,
        authType: settings.authType,
        timezone: settings.timezone,
        dbHost: settings.dbHost,
        dbPort: settings.dbPort,
        dbUser: settings.dbUser,
        dbPassword: settings.dbPassword,
        dbName: settings.dbName,
      },
    };

    const blob = new Blob([JSON.stringify(configuration, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "configuration.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Global Key</label>
        <input
          type="text"
          name="globalKey"
          value={settings?.globalKey || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Enter global key"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Database Type</label>
        <select
          name="databaseType"
          value={settings?.databaseType || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Database Type</option>
          <option value="mysql">MySQL</option>
          <option value="postgresql">PostgreSQL</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Authentication Type
        </label>
        <select
          name="authType"
          value={settings?.authType || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="session">Session</option>
          <option value="jwt">JWT</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Timezone</label>
        <select
          name="timezone"
          value={settings?.timezone || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="UTC">UTC</option>
          <option value="America/New_York">America/New_York</option>
          <option value="Europe/London">Europe/London</option>
          <option value="Asia/Tokyo">Asia/Tokyo</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Database Credentials
        </label>

        <div>
          <input
            type="text"
            name="dbHost"
            value={settings?.dbHost || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
            placeholder="Host"
          />
        </div>

        <div>
          <input
            type="text"
            name="dbPort"
            value={settings?.dbPort || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
            placeholder="Port"
          />
        </div>

        <div>
          <input
            type="text"
            name="dbUser"
            value={settings?.dbUser || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
            placeholder="Username"
          />
        </div>

        <div>
          <input
            type="text"
            name="dbPassword"
            value={settings?.dbPassword || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
            placeholder="Password"
          />
        </div>

        <div>
          <input
            type="text"
            name="dbName"
            value={settings?.dbName || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Database Name"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        <Save className="w-4 h-4" />
        Save Settings
      </button>

      <div className="mt-6">
        <button
          onClick={handleExportConfiguration}
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Export Configuration
        </button>
      </div>
    </div>
  );
}
