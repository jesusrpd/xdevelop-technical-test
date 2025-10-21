"use client";
import React from "react";
import axios from "axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  Table,
  Column,
} from "@tanstack/react-table";
import { Button, Select, Skeleton } from "@radix-ui/themes";
import { create } from 'zustand'

type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
};

export default function Users() {
  const [pageIndex, setPageIndex] = React.useState(0);
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>(
    {}
  );

  // Query con paginación (dependiente de pageIndex)
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["users", pageIndex],
    queryFn: async () => {
      const res = await axios.get(`https://reqres.in/api/users?page=${pageIndex + 1}`, {headers: {'x-api-key': 'reqres-free-v1'}});
      console.log(res.data);
      const usersApi = res.data
      const addRoles = {
        ...usersApi,
        users: usersApi.data.map(user => ({
          ...user,
          role: process.env.NEXT_PUBLIC_ADMINS?.split(",").includes(user.email) ? "admin" : "user"
        }))
      }
      console.log(addRoles);
      
      return addRoles;
    },
    placeholderData: keepPreviousData,
  });

  const columns = React.useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <IndeterminateCheckbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <IndeterminateCheckbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      },
      {
        header: "Usuarios",
        columns: [
          {
            accessorKey: "first_name",
            header: ({ column, table }) => (
              <div className="flex flex-col">
                <span>Nombre</span>
                <div className="mt-1">
                  <Filter column={column} table={table} />
                </div>
              </div>
            ),
            cell: (info) => info.getValue(),
          },
          {
            accessorKey: "last_name",
            header: ({ column, table }) => (
              <div className="flex flex-col">
                <span>Apellido</span>
                <div className="mt-1">
                  <Filter column={column} table={table} />
                </div>
              </div>
            ),
            cell: (info) => info.getValue(),
          },
          {
            accessorKey: "email",
            header: ({ column, table }) => (
              <div className="flex flex-col">
                <span>Correo</span>
                <div className="mt-1">
                  <Filter column={column} table={table} />
                </div>
              </div>
            ),
            cell: (info) => info.getValue(),
          },
          {
            accessorKey: "role",
            header: ({ column, table }) => (
              <div className="flex flex-col">
                <span>Role</span>
                <div className="mt-1">
                  <Filter column={column} table={table} />
                </div>
              </div>
            ),
            cell: (info) => info.getValue(),
          },
          {
            accessorKey: "avatar",
            header: "Avatar",
            cell: (info) => (
              <img
                src={info.getValue() as string}
                alt="avatar"
                className="w-10 h-10 rounded-full mx-auto"
              />
            ),
          },
        ],
      },
    ],
    []
  );

  const table = useReactTable({
    data: data?.users ?? [],
    columns,
    pageCount: data ? data.total_pages : -1,
    state: {
      pagination: { pageIndex, pageSize: 6 },
      rowSelection,
    },
    manualPagination: true,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({ pageIndex, pageSize: 6 });
        setPageIndex(newState.pageIndex);
      } else {
        setPageIndex(updater.pageIndex);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
  });

  if (isError) return <p>Error: {(error as Error).message}</p>;

  return (
    <div className="p-4">
      <Skeleton loading={isLoading}>
        <table className="min-w-full border-collapse border border-gray-700">
          <thead className="bg-gray-800 text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-2 border border-gray-700 text-left">
                    {header.isPlaceholder ? null : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="text-center odd:bg-gray-900 even:bg-gray-800">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-2 border border-gray-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Skeleton>

      {/* Paginación */}
      <div className="flex items-center gap-2 mt-4">
        <Button
          onClick={() => setPageIndex(0)}
          disabled={pageIndex === 0}
          variant="outline"
          className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          {"<<"}
        </Button>
        <Button
          onClick={() => setPageIndex((old) => Math.max(old - 1, 0))}
          disabled={pageIndex === 0}
          className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          {"<"}
        </Button>
        <Button
          onClick={() => setPageIndex((old) => old + 1)}
          disabled={!data || pageIndex + 1 >= data.total_pages}
          className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          {">"}
        </Button>
        <Button
          onClick={() => setPageIndex((data?.total_pages ?? 1) - 1)}
          disabled={!data || pageIndex + 1 >= data.total_pages}
          className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
          variant="outline"
        >
          {">>"}
        </Button>

        <span>
          Página {pageIndex + 1} de {data?.total_pages ?? 1}
        </span>
      </div>

      <div className="mt-2 text-sm">Usuarios seleccionados: {Object.keys(rowSelection).length}</div>
    </div>
  );
}

/* Checkbox con estado indeterminado */
function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & React.HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === "boolean" && ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + " cursor-pointer"}
      {...rest}
    />
  );
}

/* Componente Filter reutilizable (texto o número) */
function Filter({ column, table }: { column: Column<any, any>; table: Table<any> }) {
  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);

  if (column.id === "role") {
    const value = (column.getFilterValue() as string) ?? ""
    return (
      <Select.Root
        value={value}
        defaultValue="todos"
        onValueChange={(val) => {
          // Si el valor es vacío o "Todos", eliminamos el filtro
          if (val === "" || val === "todos") {
            column.setFilterValue(undefined);
          } else {
            column.setFilterValue(val);
          }
        }}
      >
        <Select.Trigger/>
        <Select.Content>
          <Select.Item value="todos">Todos</Select.Item>
          <Select.Item value="admin">Admin</Select.Item>
          <Select.Item value="user">User</Select.Item>
        </Select.Content>
      </Select.Root>
    )
  }

  return typeof firstValue === "number" ? (
    <div className="flex space-x-2">
      <input
        type="number"
        value={((column.getFilterValue() as any)?.[0] ?? "") as string}
        onChange={(e) => column.setFilterValue((old: any) => [e.target.value, old?.[1]])}
        placeholder={`Min`}
        className="w-24 border shadow rounded px-1 py-0.5"
      />
      <input
        type="number"
        value={((column.getFilterValue() as any)?.[1] ?? "") as string}
        onChange={(e) => column.setFilterValue((old: any) => [old?.[0], e.target.value])}
        placeholder={`Max`}
        className="w-24 border shadow rounded px-1 py-0.5"
      />
    </div>
  ) : (
    <input
      type="text"
      value={(column.getFilterValue() ?? "") as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Buscar...`}
      className="w-36 border shadow rounded px-1 py-0.5 border-teal-500"
    />
  );
}
