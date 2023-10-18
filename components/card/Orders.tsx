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
import { MdOutlineDelete } from "react-icons/md"
import { useDispatch } from "react-redux";

import { capitalize } from "@/lib/utils";
import { getColumns } from "@/lib/constant/OrderTableColumns"
import { useAppSelector } from "@/redux/store";
import { setOrders } from "@/redux/features/orders.slice";
import { formattedPriceWithUnit } from "@/lib/formattedPriceWithUnit";
import { formatDate } from "@/lib/formatDate";
import OrderDetailModal from "../modal/OrderDetailModal";

const statusColorMap: Record<string, ChipProps["color"]> = {
  pending: "warning",
  processed: "success",
  shipped: "success",
  delivered: "success",
  canceled: "danger",
};

const statusOptions = [
  { name: "Đang chờ", uid: "pending" },
  { name: "Đã duyệt", uid: "processed" },
  { name: "Đang vận chuyển", uid: "shipped" },
  { name: "Đã giao hàng", uid: "delivered" },
  { name: "Bị Huỷ", uid: "canceled" },
];

const INITIAL_VISIBLE_COLUMNS = ["Khách hàng", "Ngày mua", "Trạng thái", "Giá trị đơn hàng", "Thao tác"];

type IProps = {
  isLoading: boolean
  orders: IOrders[] | [],
  role: string,
  shopId?: string
}

const Orders: React.FC<IProps> = ({ isLoading, orders, role, shopId }) => {
  const [filterValue, setFilterValue] = React.useState("");
  // const [isLoading, setIsLoading] = React.useState(true);
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "date",
    direction: "ascending",
  });
  const dispatch = useDispatch()
  const [page, setPage] = React.useState(1);
  const [orderSelected, setOrderSelected] = React.useState<string>("")
  const { isOpen: isOpenOrderDetail, onOpen: onOpenOrderDetail, onOpenChange: onOpenChangeOrderDetail, onClose: onCloseOrderDetail } = useDisclosure();

  const session = useAppSelector((state) => state.sessionReducer.value)
  const columns = getColumns(session?.user.role === "shop" && session.user.shopId === shopId)

  //GET DATA
  useEffect(() => {
    if (orders && orders.length > 0) {
      dispatch(setOrders(orders))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders])

  const ordersData: IOrders[] = useAppSelector(state => state.ordersReducer.value)
  const pages = Math.ceil(ordersData.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredShops = [...ordersData];

    if (hasSearchFilter) {
      filteredShops = filteredShops.filter((order) =>
        order?.buyerPhone.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredShops = filteredShops.filter((order) =>
        Array.from(statusFilter).includes(order.status),
      );
    }

    return filteredShops;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ordersData, filterValue, statusFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: IOrders, b: IOrders) => {
      const first = a[sortDescriptor.column as keyof IOrders] as number;
      const second = b[sortDescriptor.column as keyof IOrders] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((order: IOrders, columnKey: React.Key) => {
    const cellValue = order[columnKey as keyof IOrders];

    switch (columnKey) {
      case `${session?.user.role === "shop" && session.user.shopId === shopId ? "buyerUsername" : "shopName"}`:
        return (
          <User
            avatarProps={{ radius: "full", size: "sm", src: `${session?.user.role === "shop" && session.user.shopId === shopId ? order.buyerImage : order.productImage}` }}
            classNames={{
              description: "text-default-500",
            }}
            description={`${session?.user.role === "shop" && session.user.shopId === shopId ? order.buyerPhone : order.shopPhone}`}
            name={cellValue}
          >
            {cellValue}
          </User>
        );
      case "orderDateConvert":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{formatDate(cellValue)}</p>
            {/* <p className="text-bold text-tiny capitalize text-default-500">{shop.address}</p> */}
          </div>
        );
      case "status":
        return (
          <Chip className="capitalize" color={statusColorMap[order.status]} size="sm" variant="flat">
            {order.status === "pending" ? "Đang chờ" : order.status === "processed" ? "Đã duyệt" : order.status === "shipped" ? "Đang vận chuyển"
              : order.status === "delivered" ? "Đã giao hàng" : "Bị huỷ"
            }
          </Chip>
        );
      case "totalAmount":
        return (
          <p className="text-bold text-small capitalize">{formattedPriceWithUnit(cellValue)}</p>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Xem chi tiết">
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                radius="full"
                className="border-none"
                onPress={() => {
                  setOrderSelected(order._id)
                  onOpenOrderDetail()
                }}>
                <AiOutlineEye />
              </Button>
            </Tooltip>
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
              base: "w-full",
              inputWrapper: "border-1",
            }}
            placeholder={`${session?.user.role === "shop" && session.user.shopId === shopId ? "Nhập số điện thoại khách hàng muốn tìm" : "Nhập số điện thoại cửa hàng muốn tìm"}`}
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
                  Status
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
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<BsThreeDotsVertical className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
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
          <span className="text-default-400 text-small">Hiện có {ordersData.length} đơn hàng</span>
          <label className="flex items-center text-default-400 text-small">
            Số đơn hàng mỗi trang:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
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
    ordersData.length,
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
        <span className="text-small text-default-400">
          {selectedKeys === "all"
            ? "Đã chọn tất cả"
            : `${selectedKeys.size} trên ${items.length} được chọn`}
        </span>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  const classNames = React.useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
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
        removeWrapper
        aria-label="Bảng đơn hàng"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        checkboxesProps={{
          classNames: {
            wrapper: "after:bg-foreground after:text-background text-background",
          },
        }}
        classNames={classNames}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
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
        <TableBody isLoading={isLoading} emptyContent={"Không tìm thấy đơn hàng hàng"} items={sortedItems}>
          {(item) => (
            <TableRow key={item._id} >
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {
        isOpenOrderDetail && (
          <OrderDetailModal
            isOpenOrderDetailModal={isOpenOrderDetail}
            onCloseOrderDetailModal={onCloseOrderDetail}
            onOpenChangeOrderDetailModal={onOpenChangeOrderDetail}
            id={orderSelected}
          />
        )
      }
    </>
  );
}

export default Orders