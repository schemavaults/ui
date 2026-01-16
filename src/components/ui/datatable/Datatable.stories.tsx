import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { Datatable } from "./datatable";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const users: User[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", role: "Editor", status: "Active" },
  { id: "3", name: "Charlie Brown", email: "charlie@example.com", role: "Viewer", status: "Inactive" },
  { id: "4", name: "Diana Prince", email: "diana@example.com", role: "Admin", status: "Active" },
  { id: "5", name: "Edward Norton", email: "edward@example.com", role: "Editor", status: "Pending" },
  { id: "6", name: "Fiona Apple", email: "fiona@example.com", role: "Viewer", status: "Active" },
  { id: "7", name: "George Lucas", email: "george@example.com", role: "Admin", status: "Active" },
  { id: "8", name: "Hannah Montana", email: "hannah@example.com", role: "Editor", status: "Inactive" },
];

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];

function EmptyHeaderButtons(): ReactElement {
  return <></>;
}

function ExampleHeaderButtons(): ReactElement {
  return (
    <Button variant="outline" size="sm">
      Add User
    </Button>
  );
}

function SingleColumnSearchDemo(): ReactElement {
  return (
    <Datatable
      data={users}
      columns={columns}
      initialVisibleColumns={{}}
      HeaderButtons={ExampleHeaderButtons}
      datatypeLabel="User"
      searchColumn="name"
    />
  );
}

function MultiColumnSearchDemo(): ReactElement {
  return (
    <Datatable
      data={users}
      columns={columns}
      initialVisibleColumns={{}}
      HeaderButtons={ExampleHeaderButtons}
      datatypeLabel="User"
      searchColumn={["name", "email"]}
    />
  );
}

function GlobalFilterDemo(): ReactElement {
  return (
    <Datatable
      data={users}
      columns={columns}
      initialVisibleColumns={{}}
      HeaderButtons={ExampleHeaderButtons}
      datatypeLabel="User"
      enableGlobalFilter
    />
  );
}

function NoSearchDemo(): ReactElement {
  return (
    <Datatable
      data={users}
      columns={columns}
      initialVisibleColumns={{}}
      HeaderButtons={EmptyHeaderButtons}
      datatypeLabel="User"
    />
  );
}

function WithHiddenColumnsDemo(): ReactElement {
  return (
    <Datatable
      data={users}
      columns={columns}
      initialVisibleColumns={{ email: false }}
      HeaderButtons={ExampleHeaderButtons}
      datatypeLabel="User"
      searchColumn="name"
    />
  );
}

const meta = {
  title: "Components/Datatable",
  component: SingleColumnSearchDemo,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {},
} satisfies Meta<typeof SingleColumnSearchDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleColumnSearch: Story = {
  render: (): ReactElement => <SingleColumnSearchDemo />,
};

export const MultiColumnSearch: Story = {
  render: (): ReactElement => <MultiColumnSearchDemo />,
};

export const GlobalFilter: Story = {
  render: (): ReactElement => <GlobalFilterDemo />,
};

export const NoSearch: Story = {
  render: (): ReactElement => <NoSearchDemo />,
};

export const WithHiddenColumns: Story = {
  render: (): ReactElement => <WithHiddenColumnsDemo />,
};
