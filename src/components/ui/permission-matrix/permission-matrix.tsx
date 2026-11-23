"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cva } from "class-variance-authority";
import { Check, Lock, Minus } from "lucide-react";
import {
  Fragment,
  useCallback,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";

import { cn } from "@/lib/utils";

export const permissionMatrixVariantIds = [
  "default",
  "bordered",
  "striped",
] as const;
export type PermissionMatrixVariant =
  (typeof permissionMatrixVariantIds)[number];

export const permissionMatrixSizeIds = ["sm", "default"] as const;
export type PermissionMatrixSize = (typeof permissionMatrixSizeIds)[number];

export const permissionMatrixColorIds = [
  "primary",
  "success",
  "warning",
  "destructive",
] as const;
export type PermissionMatrixColor = (typeof permissionMatrixColorIds)[number];

export interface PermissionMatrixRole {
  id: string;
  label: ReactNode;
  /** Short helper text shown under the role name in the header. */
  description?: ReactNode;
  /**
   * A locked role cannot be edited (e.g. an "Owner" role that always has
   * every permission). Its cells render as read-only marks with a lock icon.
   */
  locked?: boolean;
}

export interface PermissionMatrixPermission {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  /** Permissions sharing a group id are rendered under one group header. */
  group?: string;
}

export interface PermissionMatrixGroup {
  id: string;
  label: ReactNode;
}

/** Map of role id → the permission ids that role is granted. */
export type PermissionMatrixValue = Record<string, string[]>;

const cellColorClasses: Record<PermissionMatrixColor, string> = {
  primary:
    "border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground",
  success:
    // @schemavaults/theme has no success token yet; mirror UptimeBar's emerald.
    "border-emerald-600 dark:border-emerald-400 data-[state=checked]:bg-emerald-600 data-[state=checked]:text-white data-[state=indeterminate]:bg-emerald-600 data-[state=indeterminate]:text-white dark:data-[state=checked]:bg-emerald-400 dark:data-[state=checked]:text-emerald-950 dark:data-[state=indeterminate]:bg-emerald-400 dark:data-[state=indeterminate]:text-emerald-950",
  warning:
    "border-warning data-[state=checked]:bg-warning data-[state=checked]:text-warning-foreground data-[state=indeterminate]:bg-warning data-[state=indeterminate]:text-warning-foreground",
  destructive:
    "border-destructive data-[state=checked]:bg-destructive data-[state=checked]:text-destructive-foreground data-[state=indeterminate]:bg-destructive data-[state=indeterminate]:text-destructive-foreground",
};

const markColorClasses: Record<PermissionMatrixColor, string> = {
  primary: "text-primary",
  success: "text-emerald-600 dark:text-emerald-400",
  warning: "text-warning",
  destructive: "text-destructive",
};

const permissionMatrixVariants = cva(
  "w-full border-collapse text-left text-foreground",
  {
    variants: {
      variant: {
        default: "[&_tbody_tr]:border-b [&_tbody_tr]:border-border",
        bordered:
          "[&_td]:border [&_th]:border [&_td]:border-border [&_th]:border-border",
        striped: "[&_tbody_tr[data-row]:nth-child(even)]:bg-muted/40",
      } satisfies Record<PermissionMatrixVariant, string>,
      size: {
        sm: "text-xs [&_td]:px-2 [&_td]:py-1.5 [&_th]:px-2 [&_th]:py-1.5",
        default: "text-sm [&_td]:px-3 [&_td]:py-2.5 [&_th]:px-3 [&_th]:py-2.5",
      } satisfies Record<PermissionMatrixSize, string>,
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

type CheckState = boolean | "indeterminate";

function aggregate(granted: number, total: number): CheckState {
  if (total === 0 || granted === 0) return false;
  if (granted === total) return true;
  return "indeterminate";
}

interface MatrixCheckboxProps {
  checked: CheckState;
  onCheckedChange: (next: boolean) => void;
  disabled?: boolean;
  color: PermissionMatrixColor;
  size: PermissionMatrixSize;
  "aria-label": string;
}

function MatrixCheckbox({
  checked,
  onCheckedChange,
  disabled,
  color,
  size,
  "aria-label": ariaLabel,
}: MatrixCheckboxProps): ReactElement {
  const box = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const icon = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";
  return (
    <CheckboxPrimitive.Root
      aria-label={ariaLabel}
      checked={checked}
      disabled={disabled}
      // Clicking an indeterminate aggregate grants everything.
      onCheckedChange={(next) => onCheckedChange(next === true)}
      className={cn(
        "peer inline-flex shrink-0 items-center justify-center rounded-sm border ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        box,
        cellColorClasses[color],
      )}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        {checked === "indeterminate" ? (
          <Minus className={icon} strokeWidth={3} />
        ) : (
          <Check className={icon} strokeWidth={3} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

interface ReadOnlyMarkProps {
  granted: boolean;
  locked?: boolean;
  color: PermissionMatrixColor;
  size: PermissionMatrixSize;
  label: string;
}

function ReadOnlyMark({
  granted,
  locked,
  color,
  size,
  label,
}: ReadOnlyMarkProps): ReactElement {
  const icon = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <span
      role="img"
      aria-label={`${label}: ${granted ? "granted" : "not granted"}${locked ? " (locked)" : ""}`}
      data-granted={granted ? "true" : "false"}
      className="inline-flex items-center justify-center gap-0.5"
    >
      {granted ? (
        <Check
          className={cn(icon, markColorClasses[color])}
          strokeWidth={3}
          aria-hidden="true"
        />
      ) : (
        <Minus
          className={cn(icon, "text-muted-foreground/50")}
          aria-hidden="true"
        />
      )}
    </span>
  );
}

function textOf(node: ReactNode, fallback: string): string {
  return typeof node === "string" || typeof node === "number"
    ? String(node)
    : fallback;
}

export interface PermissionMatrixProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  ref?: Ref<HTMLDivElement>;
  /** Columns of the matrix. */
  roles: PermissionMatrixRole[];
  /** Rows of the matrix. */
  permissions: PermissionMatrixPermission[];
  /** Optional labels for the `group` ids used on permissions, in display order. */
  groups?: PermissionMatrixGroup[];
  /** Controlled value. */
  value?: PermissionMatrixValue;
  /** Initial value when uncontrolled. */
  defaultValue?: PermissionMatrixValue;
  onValueChange?: (value: PermissionMatrixValue) => void;
  /** Render marks instead of checkboxes; nothing can be changed. */
  readOnly?: boolean;
  /** Render checkboxes but disable all of them. */
  disabled?: boolean;
  /** Show a "toggle all" checkbox under each role header. */
  showRoleToggles?: boolean;
  /** Show a "toggle all roles" checkbox at the end of each permission row. */
  showPermissionToggles?: boolean;
  /** Show a "toggle group" checkbox per role on each group header row. */
  showGroupToggles?: boolean;
  /** Label for the first header cell. */
  permissionColumnLabel?: ReactNode;
  variant?: PermissionMatrixVariant;
  size?: PermissionMatrixSize;
  /** Colour of granted cells, drawn from @schemavaults/theme tokens. */
  color?: PermissionMatrixColor;
  /** Accessible caption for the table. */
  caption?: ReactNode;
  /** Visually hide the caption (still read by screen readers). */
  hideCaption?: boolean;
}

function PermissionMatrix({
  ref,
  roles,
  permissions,
  groups,
  value: valueProp,
  defaultValue,
  onValueChange,
  readOnly = false,
  disabled = false,
  showRoleToggles = false,
  showPermissionToggles = false,
  showGroupToggles = true,
  permissionColumnLabel = "Permission",
  variant = "default",
  size = "default",
  color = "primary",
  caption,
  hideCaption = false,
  className,
  ...props
}: PermissionMatrixProps): ReactElement {
  const [internal, setInternal] = useState<PermissionMatrixValue>(
    () => defaultValue ?? {},
  );
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internal;

  const lockedRoleIds = useMemo(
    () => new Set(roles.filter((r) => r.locked).map((r) => r.id)),
    [roles],
  );
  const editableRoles = useMemo(
    () => roles.filter((r) => !r.locked),
    [roles],
  );

  const grantedSets = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const role of roles) {
      // Locked roles that aren't listed in the value are treated as having
      // every permission, which is the usual "Owner" semantics.
      const listed = value[role.id];
      map.set(
        role.id,
        new Set(
          listed ?? (role.locked ? permissions.map((p) => p.id) : []),
        ),
      );
    }
    return map;
  }, [roles, permissions, value]);

  const isGranted = useCallback(
    (roleId: string, permissionId: string): boolean =>
      grantedSets.get(roleId)?.has(permissionId) ?? false,
    [grantedSets],
  );

  const commit = useCallback(
    (
      cells: Array<{ roleId: string; permissionId: string }>,
      grant: boolean,
    ): void => {
      const next: PermissionMatrixValue = {};
      for (const role of roles) {
        next[role.id] = Array.from(grantedSets.get(role.id) ?? []);
      }
      for (const { roleId, permissionId } of cells) {
        if (lockedRoleIds.has(roleId)) continue;
        const set = new Set(next[roleId]);
        if (grant) set.add(permissionId);
        else set.delete(permissionId);
        // Keep ids in the permission list's order for stable output.
        next[roleId] = permissions
          .map((p) => p.id)
          .filter((id) => set.has(id));
      }
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
    },
    [roles, permissions, grantedSets, lockedRoleIds, isControlled, onValueChange],
  );

  const sections = useMemo(() => {
    const order: string[] = groups?.map((g) => g.id) ?? [];
    const byGroup = new Map<string, PermissionMatrixPermission[]>();
    for (const p of permissions) {
      const key = p.group ?? "";
      if (!byGroup.has(key)) {
        byGroup.set(key, []);
        if (!order.includes(key)) order.push(key);
      }
      byGroup.get(key)!.push(p);
    }
    return order
      .filter((id) => byGroup.has(id))
      .map((id) => ({
        id,
        label: groups?.find((g) => g.id === id)?.label ?? (id || null),
        permissions: byGroup.get(id)!,
      }));
  }, [permissions, groups]);

  const interactive = !readOnly;
  const cellsDisabled = disabled;
  const colCount = 1 + roles.length + (showPermissionToggles && interactive ? 1 : 0);

  const countGranted = (
    roleIds: string[],
    perms: PermissionMatrixPermission[],
  ): number =>
    roleIds.reduce(
      (n, r) => n + perms.filter((p) => isGranted(r, p.id)).length,
      0,
    );

  const renderCell = (
    role: PermissionMatrixRole,
    permission: PermissionMatrixPermission,
  ): ReactElement => {
    const granted = isGranted(role.id, permission.id);
    const label = `${textOf(permission.label, permission.id)} for ${textOf(role.label, role.id)}`;
    if (readOnly || role.locked) {
      return (
        <ReadOnlyMark
          granted={granted}
          locked={role.locked}
          color={color}
          size={size}
          label={label}
        />
      );
    }
    return (
      <MatrixCheckbox
        aria-label={label}
        checked={granted}
        disabled={cellsDisabled}
        color={color}
        size={size}
        onCheckedChange={(next) =>
          commit([{ roleId: role.id, permissionId: permission.id }], next)
        }
      />
    );
  };

  return (
    <div
      ref={ref}
      data-slot="permission-matrix"
      className={cn(
        "relative w-full overflow-x-auto rounded-lg border border-border bg-card text-card-foreground",
        className,
      )}
      {...props}
    >
      <table
        className={permissionMatrixVariants({ variant, size })}
        data-variant={variant}
      >
        {caption ? (
          <caption
            className={cn(
              "px-3 pt-3 text-left text-sm font-medium text-muted-foreground",
              hideCaption && "sr-only",
            )}
          >
            {caption}
          </caption>
        ) : null}
        <thead className="bg-muted/50">
          <tr className="border-b border-border">
            <th
              scope="col"
              className="sticky left-0 z-10 min-w-[12rem] bg-muted/95 font-medium text-muted-foreground backdrop-blur"
            >
              {permissionColumnLabel}
            </th>
            {roles.map((role) => {
              const all = aggregate(
                countGranted([role.id], permissions),
                permissions.length,
              );
              return (
                <th
                  key={role.id}
                  scope="col"
                  data-role={role.id}
                  className="min-w-[6rem] text-center align-bottom font-medium"
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="inline-flex items-center gap-1 whitespace-nowrap">
                      {role.label}
                      {role.locked ? (
                        <Lock
                          className="h-3 w-3 text-muted-foreground"
                          aria-label="locked"
                        />
                      ) : null}
                    </span>
                    {role.description ? (
                      <span className="text-[0.7rem] font-normal leading-tight text-muted-foreground">
                        {role.description}
                      </span>
                    ) : null}
                    {showRoleToggles && interactive && !role.locked ? (
                      <MatrixCheckbox
                        aria-label={`All permissions for ${textOf(role.label, role.id)}`}
                        checked={all}
                        disabled={cellsDisabled}
                        color={color}
                        size={size}
                        onCheckedChange={(next) =>
                          commit(
                            permissions.map((p) => ({
                              roleId: role.id,
                              permissionId: p.id,
                            })),
                            next,
                          )
                        }
                      />
                    ) : null}
                  </div>
                </th>
              );
            })}
            {showPermissionToggles && interactive ? (
              <th
                scope="col"
                className="text-center font-medium text-muted-foreground"
              >
                All
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {sections.map((section) => (
            <Fragment key={section.id || "__ungrouped"}>
              {section.label ? (
                <tr
                  data-group={section.id}
                  className="bg-muted/30"
                >
                  <th
                    scope="rowgroup"
                    className="sticky left-0 z-10 bg-muted/95 text-xs font-semibold uppercase tracking-wide text-muted-foreground backdrop-blur"
                  >
                    {section.label}
                  </th>
                  {roles.map((role) => (
                    <td key={role.id} className="text-center">
                      {showGroupToggles && interactive && !role.locked ? (
                        <MatrixCheckbox
                          aria-label={`All ${textOf(section.label, section.id)} permissions for ${textOf(role.label, role.id)}`}
                          checked={aggregate(
                            countGranted([role.id], section.permissions),
                            section.permissions.length,
                          )}
                          disabled={cellsDisabled}
                          color={color}
                          size={size}
                          onCheckedChange={(next) =>
                            commit(
                              section.permissions.map((p) => ({
                                roleId: role.id,
                                permissionId: p.id,
                              })),
                              next,
                            )
                          }
                        />
                      ) : null}
                    </td>
                  ))}
                  {showPermissionToggles && interactive ? <td /> : null}
                </tr>
              ) : null}
              {section.permissions.map((permission) => (
                <tr
                  key={permission.id}
                  data-row=""
                  data-permission={permission.id}
                  className="transition-colors hover:bg-muted/40"
                >
                  <th
                    scope="row"
                    className="sticky left-0 z-10 bg-card font-normal"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{permission.label}</span>
                      {permission.description ? (
                        <span className="text-xs text-muted-foreground">
                          {permission.description}
                        </span>
                      ) : null}
                    </div>
                  </th>
                  {roles.map((role) => (
                    <td key={role.id} className="text-center">
                      <div className="flex items-center justify-center">
                        {renderCell(role, permission)}
                      </div>
                    </td>
                  ))}
                  {showPermissionToggles && interactive ? (
                    <td className="text-center">
                      <div className="flex items-center justify-center">
                        <MatrixCheckbox
                          aria-label={`${textOf(permission.label, permission.id)} for all roles`}
                          checked={aggregate(
                            countGranted(
                              editableRoles.map((r) => r.id),
                              [permission],
                            ),
                            editableRoles.length,
                          )}
                          disabled={cellsDisabled || editableRoles.length === 0}
                          color={color}
                          size={size}
                          onCheckedChange={(next) =>
                            commit(
                              editableRoles.map((r) => ({
                                roleId: r.id,
                                permissionId: permission.id,
                              })),
                              next,
                            )
                          }
                        />
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))}
            </Fragment>
          ))}
          {permissions.length === 0 ? (
            <tr>
              <td
                colSpan={colCount}
                className="text-center text-muted-foreground"
              >
                No permissions defined.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
PermissionMatrix.displayName = "PermissionMatrix";

export { PermissionMatrix, permissionMatrixVariants };
export default PermissionMatrix;
