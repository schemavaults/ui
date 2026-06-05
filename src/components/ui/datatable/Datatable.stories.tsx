import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ReactElement } from "react";

import {
  Datatable,
  type ColumnDef,
  type RowSelectionState,
} from "./datatable";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const users: User[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    role: "Editor",
    status: "Active",
  },
  {
    id: "3",
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "Viewer",
    status: "Inactive",
  },
  {
    id: "4",
    name: "Diana Prince",
    email: "diana@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: "5",
    name: "Edward Norton",
    email: "edward@example.com",
    role: "Editor",
    status: "Pending",
  },
  {
    id: "6",
    name: "Fiona Apple",
    email: "fiona@example.com",
    role: "Viewer",
    status: "Active",
  },
  {
    id: "7",
    name: "George Lucas",
    email: "george@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: "8",
    name: "Hannah Montana",
    email: "hannah@example.com",
    role: "Editor",
    status: "Inactive",
  },
];

/** Larger dataset for pagination demos. */
const manyUsers: User[] = Array.from({ length: 55 }, (_, i) => ({
  id: String(i + 1),
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: ["Admin", "Editor", "Viewer"][i % 3] as string,
  status: ["Active", "Inactive", "Pending"][i % 3] as string,
}));

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

function CustomPageSizeDemo(): ReactElement {
  return (
    <Datatable
      data={manyUsers}
      columns={columns}
      initialVisibleColumns={{}}
      HeaderButtons={ExampleHeaderButtons}
      datatypeLabel="User"
      searchColumn="name"
      defaultPageSize={5}
      pageSizeOptions={[5, 10, 25, 50]}
    />
  );
}

function LargePageSizeDemo(): ReactElement {
  return (
    <Datatable
      data={manyUsers}
      columns={columns}
      initialVisibleColumns={{}}
      HeaderButtons={ExampleHeaderButtons}
      datatypeLabel="User"
      searchColumn="name"
      defaultPageSize={50}
    />
  );
}

export const CustomPageSize: Story = {
  render: (): ReactElement => <CustomPageSizeDemo />,
};

export const LargeDefaultPageSize: Story = {
  render: (): ReactElement => <LargePageSizeDemo />,
};

function SortableColumnsDemo(): ReactElement {
  return (
    <Datatable
      data={users}
      columns={columns}
      initialVisibleColumns={{}}
      HeaderButtons={ExampleHeaderButtons}
      datatypeLabel="User"
      searchColumn="name"
      sortableColumns={["name", "role", "status"]}
    />
  );
}

function DefaultSortDemo(): ReactElement {
  return (
    <Datatable
      data={manyUsers}
      columns={columns}
      initialVisibleColumns={{}}
      HeaderButtons={ExampleHeaderButtons}
      datatypeLabel="User"
      searchColumn="name"
      sortableColumns={["name", "email", "role", "status"]}
      defaultSort={{ id: "name", desc: false }}
    />
  );
}

export const SortableColumns: Story = {
  render: (): ReactElement => <SortableColumnsDemo />,
};

export const DefaultSort: Story = {
  render: (): ReactElement => <DefaultSortDemo />,
};

/**
 * Returns the names of the users whose ids are marked selected, preserving the
 * original data order so the readout is stable.
 */
function selectedUserNames(selection: RowSelectionState): string[] {
  return users.filter((user) => selection[user.id]).map((user) => user.name);
}

/**
 * Controlled multi-row selection. The selection lives in this component's own
 * `useState` and is passed back into the Datatable via `selected`, so the table
 * renders exactly what the parent owns. `getRowId` keys the selection by
 * `user.id` (rather than row index) so the external state stays meaningful and
 * stable across sorting/filtering/pagination.
 */
function ControlledSelectionDemo(): ReactElement {
  const [selected, setSelected] = useState<RowSelectionState>({});
  const selectedNames: string[] = selectedUserNames(selected);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={(): void => {
            const everyone: RowSelectionState = {};
            for (const user of users) {
              everyone[user.id] = true;
            }
            setSelected(everyone);
          }}
        >
          Select all
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={(): void => {
            const admins: RowSelectionState = {};
            for (const user of users) {
              if (user.role === "Admin") {
                admins[user.id] = true;
              }
            }
            setSelected(admins);
          }}
        >
          Select admins
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={(): void => setSelected({})}
        >
          Clear selection
        </Button>
      </div>
      <div className="rounded-md border bg-muted/40 p-3 text-sm">
        <span className="font-medium">{selectedNames.length}</span> selected
        {selectedNames.length > 0 && (
          <span className="text-muted-foreground">
            {" "}
            — {selectedNames.join(", ")}
          </span>
        )}
      </div>
      <Datatable
        data={users}
        columns={columns}
        initialVisibleColumns={{}}
        HeaderButtons={ExampleHeaderButtons}
        datatypeLabel="User"
        searchColumn="name"
        enableRowSelection
        getRowId={(user): string => user.id}
        selected={selected}
        onSelectedChange={setSelected}
      />
    </div>
  );
}

/**
 * Controlled selection that starts with several rows already selected, showing
 * that the table renders whatever selection the parent provides on mount.
 */
function PreselectedRowsDemo(): ReactElement {
  const [selected, setSelected] = useState<RowSelectionState>({
    "1": true,
    "3": true,
    "5": true,
  });
  const selectedNames: string[] = selectedUserNames(selected);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border bg-muted/40 p-3 text-sm">
        <span className="font-medium">{selectedNames.length}</span> selected
        {selectedNames.length > 0 && (
          <span className="text-muted-foreground">
            {" "}
            — {selectedNames.join(", ")}
          </span>
        )}
      </div>
      <Datatable
        data={users}
        columns={columns}
        initialVisibleColumns={{}}
        HeaderButtons={EmptyHeaderButtons}
        datatypeLabel="User"
        searchColumn="name"
        enableRowSelection
        getRowId={(user): string => user.id}
        selected={selected}
        onSelectedChange={setSelected}
      />
    </div>
  );
}

export const ControlledSelection: Story = {
  render: (): ReactElement => <ControlledSelectionDemo />,
};

export const PreselectedRows: Story = {
  render: (): ReactElement => <PreselectedRowsDemo />,
};
