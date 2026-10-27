/// <reference types="bun-types" />
import { describe, expect, test } from "bun:test";
import { resolveDashboardSidebarItemGroupCollapsed } from "./dashboard-sidebar-item-group-collapsed";
import type { DashboardSidebarItemGroupDefinition } from "./dashboard-sidebar-item-group";

function group(
  overrides: Partial<DashboardSidebarItemGroupDefinition> = {},
): DashboardSidebarItemGroupDefinition {
  return {
    type: "dashboard-sidebar-item-group",
    title: "Group",
    items: [],
    ...overrides,
  };
}

describe("resolveDashboardSidebarItemGroupCollapsed", () => {
  test("a group that is not collapsible is never collapsed", () => {
    expect(resolveDashboardSidebarItemGroupCollapsed(group(), true, false)).toBe(
      false,
    );
    expect(
      resolveDashboardSidebarItemGroupCollapsed(
        group({ defaultCollapsed: true, collapsed: true }),
        true,
        false,
      ),
    ).toBe(false);
  });

  test("a collapsible group starts from defaultCollapsed", () => {
    expect(
      resolveDashboardSidebarItemGroupCollapsed(
        group({ collapsible: true }),
        undefined,
        false,
      ),
    ).toBe(false);
    expect(
      resolveDashboardSidebarItemGroupCollapsed(
        group({ collapsible: true, defaultCollapsed: true }),
        undefined,
        false,
      ),
    ).toBe(true);
  });

  test("a default never hides the active item", () => {
    expect(
      resolveDashboardSidebarItemGroupCollapsed(
        group({ collapsible: true, defaultCollapsed: true }),
        undefined,
        true,
      ),
    ).toBe(false);
  });

  test("the viewer's toggle wins over the default and the active item", () => {
    expect(
      resolveDashboardSidebarItemGroupCollapsed(
        group({ collapsible: true, defaultCollapsed: true }),
        false,
        false,
      ),
    ).toBe(false);
    expect(
      resolveDashboardSidebarItemGroupCollapsed(
        group({ collapsible: true }),
        true,
        true,
      ),
    ).toBe(true);
  });

  test("a controlled group is whatever its owner says", () => {
    expect(
      resolveDashboardSidebarItemGroupCollapsed(
        group({ collapsible: true, collapsed: true }),
        false,
        true,
      ),
    ).toBe(true);
    expect(
      resolveDashboardSidebarItemGroupCollapsed(
        group({ collapsible: true, collapsed: false, defaultCollapsed: true }),
        true,
        false,
      ),
    ).toBe(false);
  });
});
