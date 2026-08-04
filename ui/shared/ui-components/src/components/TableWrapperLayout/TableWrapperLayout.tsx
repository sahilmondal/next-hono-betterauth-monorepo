import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  type Header,
} from "@tanstack/react-table";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronsUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Skeleton,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
} from "@workspace/ui-core";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TableWrapperLayoutProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  isLoading?: boolean;
  toolbar?: React.ReactNode;
  emptyState?: React.ReactNode;
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  };
}

// ─── Sort Header ──────────────────────────────────────────────────────────────

function SortableHeader({
  column,
  label,
}: {
  column: Header<unknown, unknown>["column"];
  label: string;
}) {
  const sorted = column.getIsSorted();
  return (
    <button
      type="button"
      onClick={column.getToggleSortingHandler()}
      className="inline-flex items-center gap-1.5"
    >
      {label}
      {sorted === "asc" ? (
        <ChevronUpIcon className="size-4 text-neutral-600" />
      ) : sorted === "desc" ? (
        <ChevronDownIcon className="size-4 text-neutral-600" />
      ) : (
        <ChevronsUpDownIcon className="size-4 text-neutral-300" />
      )}
    </button>
  );
}

// ─── Skeleton Rows ────────────────────────────────────────────────────────────

function SkeletonRows({ columns }: { columns: number }) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, rowIdx) => (
        <TableRow key={rowIdx}>
          {Array.from({ length: columns }).map((_, colIdx) => (
            <TableCell key={colIdx}>
              <Skeleton className="h-4 w-full max-w-[160px]" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function PaginationBar({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: TableWrapperLayoutProps<unknown>["pagination"]) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="flex items-center justify-end gap-4 px-4 py-3">
      {/* Rows per page */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-neutral-500">Rows per page:</span>
        <Select
          value={String(pageSize)}
          onValueChange={(val) => onPageSizeChange(Number(val))}
        >
          <SelectTrigger className="h-8 w-[72px] text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 50, 100].map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Page info */}
      <span className="text-sm tabular-nums text-neutral-500">
        Page {page} of {totalPages}
      </span>

      {/* Page navigation */}
      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(1)}
          className="h-8 w-8 p-0"
        >
          <ChevronsLeftIcon className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="h-8 w-8 p-0"
        >
          <ChevronLeftIcon className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="h-8 w-8 p-0"
        >
          <ChevronRightIcon className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(totalPages)}
          className="h-8 w-8 p-0"
        >
          <ChevronsRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function TableWrapperLayout<TData>({
  columns,
  data,
  isLoading,
  toolbar,
  emptyState,
  sorting,
  onSortingChange,
  pagination,
}: TableWrapperLayoutProps<TData>) {
  const table = useReactTable({
    data,
    columns: columns as ColumnDef<unknown, unknown>[],
    state: {
      sorting: sorting ?? [],
    },
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(sorting ?? []) : updater;
      onSortingChange?.(newSorting);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    manualPagination: true,
  });

  const headerGroups = table.getHeaderGroups();
  const rowModel = table.getRowModel();
  const isEmpty = !isLoading && data.length === 0;

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background">
      {/* Toolbar */}
      {toolbar && (
        <div className="border-b border-border px-4 py-3">{toolbar}</div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {headerGroups.map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const label = header.isPlaceholder
                    ? null
                    : typeof header.column.columnDef.header === "string"
                      ? header.column.columnDef.header
                      : header.column.id;

                  return (
                    <TableHead key={header.id}>
                      {canSort && label ? (
                        <SortableHeader column={header.column} label={label} />
                      ) : (
                        (label ?? null)
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {/* Loading skeletons */}
            {isLoading && <SkeletonRows columns={columns.length} />}

            {/* Empty state */}
            {isEmpty && emptyState && (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-full p-0">
                  <div className="flex min-h-[320px] items-center justify-center">
                    {emptyState}
                  </div>
                </TableCell>
              </TableRow>
            )}

            {/* Data rows */}
            {!isLoading && !isEmpty && (
              <>
                {rowModel.rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {cell.getContext().renderValue() as React.ReactNode}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!isLoading && !isEmpty && <PaginationBar {...pagination} />}
    </div>
  );
}
