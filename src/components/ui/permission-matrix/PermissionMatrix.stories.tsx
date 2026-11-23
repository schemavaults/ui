import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { useState, type ReactElement } from "react";

import {
  PermissionMatrix,
  permissionMatrixColorIds,
  permissionMatrixSizeIds,
  permissionMatrixVariantIds,
  type PermissionMatrixGroup,
  type PermissionMatrixPermission,
  type PermissionMatrixRole,
  type PermissionMatrixValue,
} from "./permission-matrix";

const roles: PermissionMatrixRole[] = [
  { id: "owner", label: "Owner", description: "Full control", locked: true },
  { id: "admin", label: "Admin", description: "Manage vault" },
  { id: "developer", label: "Developer", description: "Read & write" },
  { id: "viewer", label: "Viewer", description: "Read only" },
];

const groups: PermissionMatrixGroup[] = [
  { id: "secrets", label: "Secrets" },
  { id: "schemas", label: "Schemas" },
  { id: "members", label: "Members" },
];

const permissions: PermissionMatrixPermission[] = [
  {
    id: "secrets.read",
    label: "Read secrets",
    description: "Reveal secret values",
    group: "secrets",
  },
  { id: "secrets.write", label: "Write secrets", group: "secrets" },
  { id: "secrets.rotate", label: "Rotate keys", group: "secrets" },
  { id: "schemas.read", label: "View schemas", group: "schemas" },
  { id: "schemas.publish", label: "Publish schemas", group: "schemas" },
  { id: "members.invite", label: "Invite members", group: "members" },
  {
    id: "members.remove",
    label: "Remove members",
    description: "Revokes all active sessions",
    group: "members",
  },
];

const initialValue: PermissionMatrixValue = {
  admin: [
    "secrets.read",
    "secrets.write",
    "secrets.rotate",
    "schemas.read",
    "schemas.publish",
    "members.invite",
  ],
  developer: ["secrets.read", "secrets.write", "schemas.read"],
  viewer: ["schemas.read"],
};

const meta = {
  title: "Forms/PermissionMatrix",
  component: PermissionMatrix,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A roles × permissions grid for access-control screens. Columns are roles, rows are permissions (optionally grouped), and each cell is a checkbox. Group header rows and the optional per-role / per-permission toggles show a tri-state (all / some / none) aggregate and grant or revoke everything they cover in one click. Locked roles (e.g. Owner) render read-only marks, and `readOnly` turns the whole grid into a summary view. The permission column is sticky so wide role sets scroll horizontally on small screens. Value shape: `Record<roleId, permissionId[]>`.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: { options: permissionMatrixVariantIds, control: { type: "radio" } },
    size: { options: permissionMatrixSizeIds, control: { type: "radio" } },
    color: { options: permissionMatrixColorIds, control: { type: "radio" } },
    readOnly: { control: { type: "boolean" } },
    disabled: { control: { type: "boolean" } },
    showRoleToggles: { control: { type: "boolean" } },
    showPermissionToggles: { control: { type: "boolean" } },
    showGroupToggles: { control: { type: "boolean" } },
  },
  args: {
    roles,
    permissions,
    groups,
    defaultValue: initialValue,
    caption: "Vault access by role",
    variant: "default",
    size: "default",
    color: "primary",
    readOnly: false,
    disabled: false,
    showRoleToggles: false,
    showPermissionToggles: false,
    showGroupToggles: true,
    onValueChange: fn(),
  },
} satisfies Meta<typeof PermissionMatrix>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAllToggles: Story = {
  args: { showRoleToggles: true, showPermissionToggles: true },
};

export const Bordered: Story = { args: { variant: "bordered" } };

export const Striped: Story = {
  args: { variant: "striped", showGroupToggles: false },
};

export const Compact: Story = {
  args: { size: "sm", variant: "bordered" },
};

export const ColorVariants: Story = {
  render: (args): ReactElement => (
    <div className="grid gap-6">
      {permissionMatrixColorIds.map((color) => (
        <PermissionMatrix
          key={color}
          {...args}
          color={color}
          caption={`color="${color}"`}
        />
      ))}
    </div>
  ),
};

export const ReadOnly: Story = {
  args: { readOnly: true, caption: "Effective permissions (read only)" },
};

export const Disabled: Story = { args: { disabled: true } };

export const Ungrouped: Story = {
  args: {
    groups: undefined,
    permissions: permissions.map(({ group: _group, ...p }) => p),
  },
};

export const Empty: Story = { args: { permissions: [] } };

function ControlledExample(): ReactElement {
  const [value, setValue] = useState<PermissionMatrixValue>(initialValue);
  return (
    <div className="grid gap-4">
      <PermissionMatrix
        roles={roles}
        permissions={permissions}
        groups={groups}
        value={value}
        onValueChange={setValue}
        showRoleToggles
      />
      <pre
        data-testid="permission-matrix-value"
        className="overflow-x-auto rounded-md bg-muted p-3 text-xs"
      >
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  );
}

export const Controlled: Story = {
  render: (): ReactElement => <ControlledExample />,
};

export const TogglesACell: Story = {
  play: async ({ canvasElement, args }): Promise<void> => {
    const canvas = within(canvasElement);
    const cell = canvas.getByRole("checkbox", {
      name: "Rotate keys for Developer",
    });
    await expect(cell).toHaveAttribute("data-state", "unchecked");
    await userEvent.click(cell);
    await waitFor(() => expect(cell).toHaveAttribute("data-state", "checked"));
    await expect(args.onValueChange).toHaveBeenCalledWith(
      expect.objectContaining({
        developer: ["secrets.read", "secrets.write", "secrets.rotate", "schemas.read"],
      }),
    );
  },
};

export const GroupToggleIsTriState: Story = {
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole("checkbox", {
      name: "All Secrets permissions for Viewer",
    });
    await expect(group).toHaveAttribute("data-state", "unchecked");

    await userEvent.click(
      canvas.getByRole("checkbox", { name: "Read secrets for Viewer" }),
    );
    await waitFor(() =>
      expect(group).toHaveAttribute("data-state", "indeterminate"),
    );

    await userEvent.click(group);
    await waitFor(() => expect(group).toHaveAttribute("data-state", "checked"));
    await expect(
      canvas.getByRole("checkbox", { name: "Rotate keys for Viewer" }),
    ).toHaveAttribute("data-state", "checked");
  },
};

export const LockedRoleIsNotEditable: Story = {
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    await expect(
      canvas.queryByRole("checkbox", { name: /for Owner$/ }),
    ).toBeNull();
    await expect(
      canvas.getByRole("img", {
        name: "Remove members for Owner: granted (locked)",
      }),
    ).toBeInTheDocument();
  },
};

export const MobileScroll: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
};
