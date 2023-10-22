"use client"

import React, { useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
  Tooltip,
  useDisclosure
} from "@nextui-org/react";
import { AiOutlineSearch, AiOutlineEye, AiOutlineEdit } from "react-icons/ai"
import { BsThreeDotsVertical } from "react-icons/bs"
// import { MdOutlineDelete } from "react-icons/md"
import { useDispatch } from "react-redux";

import { capitalize } from "@/lib/utils";
import { columns } from "@/lib/constant/ShopsTableColumns"
import { useAppSelector } from "@/redux/store";
import { getShops } from "@/actions/admin";
import { setShops } from "@/redux/features/shops-slice";
import AdminSettingShop from "@/components/modal/AdminSettingShop";

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  block: "danger",
};

const statusOptions = [
  { name: "Hoạt động", uid: "active" },
  { name: "Bị khoá", uid: "block" },
];

const INITIAL_VISIBLE_COLUMNS = ["Shops", "Địa chỉ", "Trạng thái", "Thao tác"];

// type User = typeof users[0];

export default function Shops() {
  const [filterValue, setFilterValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "Shops",
    direction: "ascending",
  });
  const dispatch = useDispatch()
  const [page, setPage] = React.useState(1);
  const [shopSelectedId, setShopSelectedId] = React.useState<string>("");
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const session = useAppSelector((state) => state.sessionReducer.value)

  //GET DATA
  useEffect(() => {
    const fetchShops = async () => {
      const res = await getShops(session?.user.accessToken!)
      if (res.code === 200 && res.data) {
        dispatch(setShops(JSON.parse(res.data)))
      }
      setIsLoading(false)
    }
    if (session) {
      fetchShops()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  const shops: IShopsResponse[] = useAppSelector(state => state.shopsReducer.value)
  const pages = Math.ceil(shops.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredShops = [...shops];

    if (hasSearchFilter) {
      filteredShops = filteredShops.filter((shop) =>
        shop.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredShops = filteredShops.filter((shop) =>
        Array.from(statusFilter).includes(shop.status),
      );
    }

    return filteredShops;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shops, filterValue, statusFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: IShopsResponse, b: IShopsResponse) => {
      const first = a[sortDescriptor.column as keyof IShopsResponse] as number;
      const second = b[sortDescriptor.column as keyof IShopsResponse] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((shop: IShopsResponse, columnKey: React.Key) => {
    const cellValue = shop[columnKey as keyof IShopsResponse];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "full", size: "sm", src: shop.image }}
            classNames={{
              description: "text-default-500",
            }}
            description={shop.username}
            name={cellValue}
          >
            {shop.name}
          </User>
        );
      case "address":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            {/* <p className="text-bold text-tiny capitalize text-default-500">{shop.address}</p> */}
          </div>
        );
      case "status":
        return (
          <Chip className="capitalize" color={statusColorMap[shop.status]} size="sm" variant="flat">
            {shop.status === "active" ? "Hoạt động" : "Bị khoá"}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Xem chi tiết">
              <Button
                variant="ghost"
                size="sm"
                radius="full"
                isIconOnly
                className="border-none"
              >
                <AiOutlineEye className="text-lg" />
              </Button>
            </Tooltip>
            <Tooltip content="Chỉnh sửa cửa hảng">
              <Button
                variant="ghost"
                size="sm"
                radius="full"
                isIconOnly
                className="border-none"
                onPress={() => {
                  setShopSelectedId(shop._id)
                  onOpen()
                }}
              >
                <AiOutlineEdit className="text-lg" />
              </Button>
            </Tooltip>
            {/* <Tooltip color="danger" content="Xoá cửa hảng">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <MdOutlineDelete />
              </span>
            </Tooltip> */}
          </div>
        );
      default:
        return cellValue;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder="Nhập tên cửa hàng muốn tìm kiếm"
            size="sm"
            startContent={<AiOutlineSearch className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<BsThreeDotsVertical className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Trạng thái
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            {/* <Button
              className="bg-foreground text-background"
              endContent={<AiOutlinePlus />}
              size="sm"
            >
              Add New
            </Button> */}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Hiện có {shops.length} cửa hàng</span>
        </div>
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    shops.length,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          color="default"
          isDisabled={hasSearchFilter}
          page={page}
          total={pages}
          variant="light"
          onChange={setPage}
        />
        {/* <span className="text-small text-default-400">
          {selectedKeys === "all"
            ? "Đã chọn tất cả"
            : `${selectedKeys.size} trên ${items.length} được chọn`}
        </span> */}
      </div>
    );
  }, [page, pages, hasSearchFilter]);

  const classNames = React.useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-full"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: [
        // changing the rows border radius
        // first
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        // middle
        "group-data-[middle=true]:before:rounded-none",
        // last
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    [],
  );

  return (
    <>
      <Table
        isCompact
        isStriped
        aria-label="Các shop trên hệ thống"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        checkboxesProps={{
          classNames: {
            wrapper: "after:bg-foreground after:text-background text-background",
          },
        }}
        classNames={classNames}
        selectedKeys={selectedKeys}
        // selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody isLoading={isLoading} emptyContent={"Không tìm thấy cửa hàng"} items={sortedItems}>
          {(item) => (
            <TableRow key={item._id} >
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {
        isOpen && (
          <AdminSettingShop
            isOpen={isOpen}
            onClose={onClose}
            onOpenChange={onOpenChange}
            shopId={shopSelectedId}
          />
        )
      }
    </>
  );
}