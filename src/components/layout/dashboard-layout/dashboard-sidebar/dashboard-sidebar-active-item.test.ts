/// <reference types="bun-types" />
import { describe, expect, test } from "bun:test";
import {
  normalizeDashboardSidebarPath,
  resolveActiveDashboardSidebarItemPath,
} from "./dashboard-sidebar-active-item";
import type { DashboardSidebarItemDefinition } from "./dashboard-sidebar-item-definition";
import type { DashboardSidebarItemsAndGroupsDefinitions } from "./dashboard-sidebar-items-and-groups-context";

function item(url: string): DashboardSidebarItemDefinition {
  return {
    type: "dashboard-sidebar-item-definition",
    title: url,
    url,
    icon: (): null => null,
  };
}

const entries: DashboardSidebarItemsAndGroupsDefinitions = [
  item("/"),
  item("/settings"),
  {
    type: "dashboard-sidebar-item-group",
    title: "Settings",
    items: [item("/settings/billing"), item("/settings/team/")],
  },
  item("#"),
  item("https://docs.example.com/settings"),
];

describe("normalizeDashboardSidebarPath", () => {
  test("drops the query, fragment and trailing slashes", () => {
    expect(normalizeDashboardSidebarPath("/a/b/?x=1#top")).toBe("/a/b");
    expect(normalizeDashboardSidebarPath("/")).toBe("/");
    expect(normalizeDashboardSidebarPath("//")).toBeNull();
  });

  test("ignores anything that is not a root-relative path", () => {
    expect(normalizeDashboardSidebarPath("#")).toBeNull();
    expect(normalizeDashboardSidebarPath("")).toBeNull();
    expect(normalizeDashboardSidebarPath("settings")).toBeNull();
    expect(normalizeDashboardSidebarPath("https://example.com/a")).toBeNull();
    expect(normalizeDashboardSidebarPath("//example.com/a")).toBeNull();
  });
});

describe("resolveActiveDashboardSidebarItemPath", () => {
  test("matches an item exactly, including one inside a group", () => {
    expect(resolveActiveDashboardSidebarItemPath(entries, "/settings")).toBe(
      "/settings",
    );
    expect(
      resolveActiveDashboardSidebarItemPath(entries, "/settings/billing"),
    ).toBe("/settings/billing");
  });

  test("the longest matching item wins for a nested page", () => {
    expect(
      resolveActiveDashboardSidebarItemPath(entries, "/settings/billing/invoices"),
    ).toBe("/settings/billing");
    expect(
      resolveActiveDashboardSidebarItemPath(entries, "/settings/profile"),
    ).toBe("/settings");
  });

  test("a trailing slash on either side does not matter", () => {
    expect(resolveActiveDashboardSidebarItemPath(entries, "/settings/")).toBe(
      "/settings",
    );
    expect(
      resolveActiveDashboardSidebarItemPath(entries, "/settings/team"),
    ).toBe("/settings/team");
  });

  test("does not match on a shared prefix that is not a path segment", () => {
    expect(
      resolveActiveDashboardSidebarItemPath(entries, "/settingsx"),
    ).toBeNull();
  });

  test("the root item only matches the root page", () => {
    expect(resolveActiveDashboardSidebarItemPath(entries, "/")).toBe("/");
    expect(resolveActiveDashboardSidebarItemPath(entries, "/unknown")).toBeNull();
  });

  test("an unknown current page marks nothing", () => {
    expect(resolveActiveDashboardSidebarItemPath(entries, undefined)).toBeNull();
    expect(resolveActiveDashboardSidebarItemPath(entries, "#")).toBeNull();
  });
});
