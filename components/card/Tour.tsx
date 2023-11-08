"use client"
import React from 'react'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
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

import { getTourType, getTourisms } from '@/actions/tourisms'
import { setTours } from '@/redux/features/tours-slice'
import { useAppSelector } from '@/redux/store';
import { columns } from '@/lib/constant/ToursColums';
import { formattedPriceWithUnit } from '@/lib/formattedPriceWithUnit';
import { capitalize } from '@/lib/utils';
import { setTourTypes } from '@/redux/features/tour-type-slice';
import EditTourStatus from '../modal/EditTourStatus';

const statusColorMap: Record<string, ChipProps["color"]> = {
  waiting: "warning",
  accepted: "success",
  refuse: "danger",
};

const statusOptions = [
  { name: "Đang chờ", uid: "waiting" },
  { name: "Đã duyệt", uid: "accepted" },
  { name: "Từ chối", uid: "refuse" },
];

const INITIAL_VISIBLE_COLUMNS = ["Tên tour", "Địa điểm đến", "Loại", "Trạng thái", "Giá", "Thời gian", "Thao tác"];

export default function Tour() {
  const dispatch = useDispatch()
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "Tên tour",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);
  const [tourSelectedId, setTourSelectedId] = React.useState<string>("");
  const { isOpen: isOpenEditStatus, onOpen: onOpenEditStatus, onOpenChange: onOpenChangeEditStatus, onClose: onCloseEditStatus } = useDisclosure();

  //Get Data
  React.useEffect(() => {
    const fetchApi = async () => {
      const res = await getTourisms()
      if (res.code === 200) {
        dispatch(setTours(JSON.parse(res.data!)))
      } else {
        toast.error(res.message)
      }
    }
    fetchApi()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    const fetchApi = async () => {
      const res = await getTourType()
      if (res.code === 200) {
        dispatch(setTourTypes(res.data!))
      } else {
        toast.error(res.message)
      }
    }
    fetchApi()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const tours: TourData[] = useAppSelector(state => state.toursReducer.value)
  const tourTypes: TourTypeData[] = useAppSelector(state => state.tourTypeReducer.value)
  const pages = Math.ceil(tours.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredShops = [...tours];

    if (hasSearchFilter) {
      filteredShops = filteredShops.filter((tour) =>
        tour.tourName.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredShops = filteredShops.filter((tour) =>
        Array.from(statusFilter).includes(tour.status),
      );
    }
    // if (tourTypesFilter !== "all" && Array.from(tourTypesFilter).length !== tourTypes.length) {
    //   filteredShops = filteredShops.filter((tour) =>
    //     Array.from(tourTypesFilter).includes(tour.tourTypeName),
    //   );
    // }

    return filteredShops;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tours, filterValue, statusFilter]);


  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: TourData, b: TourData) => {
      const first = a[sortDescriptor.column as keyof TourData];
      const second = b[sortDescriptor.column as keyof TourData];
      const cmp = first! < second! ? -1 : first! > second! ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((tour: TourData, columnKey: React.Key) => {
    const cellValue = tour[columnKey as keyof TourData];

    switch (columnKey) {
      case "username":
        return (
          <p className="text-bold text-small capitalize">{tour.username}</p>
        );
      case "tourName":
        return (
          <div className='min-w-[300px]'>
            <p className="text-bold text-small capitalize">{cellValue as string}</p>
          </div>
        );
      case "destinationName":
        return (
          <div className='min-w-[300px]'>
            <p className="text-bold text-small capitalize">{tour.destinationName}</p>
          </div>
        );
      case "tourTypeName":
        return (
          <div className="flex flex-col min-w-[100px]">
            <p className="text-bold text-small capitalize">{tour.tourTypeName}</p>
            {/* <p className="text-bold text-tiny capitalize text-default-500">{tour.address}</p> */}
          </div>
        );
      case "status":
        return (
          <Chip className="capitalize" color={statusColorMap[cellValue as string]} size="sm" variant="flat">
            {cellValue as string === "accepted" ? "Đã duyệt" : cellValue as string === "waiting" ? "Đang chờ" : "Từ chối"}
          </Chip>
        );
      case "price":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{formattedPriceWithUnit(cellValue as number)}</p>
            {/* <p className="text-bold text-tiny capitalize text-default-500">{tour.address}</p> */}
          </div>
        );
      case "duration":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue as string}</p>
            {/* <p className="text-bold text-tiny capitalize text-default-500">{tour.address}</p> */}
          </div>
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
                  setTourSelectedId(tour._id)
                  onOpenEditStatus()
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
            placeholder="Nhập tên tour muốn tìm kiếm"
            size="sm"
            startContent={<AiOutlineSearch className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger>
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
                aria-label="Table Status Columns"
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

            {/* {
              tourTypes.length > 0 && (
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      endContent={<BsThreeDotsVertical className="text-small" />}
                      size="sm"
                      variant="flat"
                    >
                      Loại tour
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    disallowEmptySelection
                    aria-label="Table Tour Types Columns"
                    closeOnSelect={false}
                    selectedKeys={tourTypesFilter}
                    selectionMode="multiple"
                    onSelectionChange={setTourTypesFilter}
                  >
                    {tourTypes.map((type) => (
                      <DropdownItem key={type.name} className="capitalize">
                        {capitalize(type.name)}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              )
            } */}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Hiện có {tours.length} tours</span>
        </div>
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    tourTypes,
    onSearchChange,
    onRowsPerPageChange,
    tours.length,
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
    <div>
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
        <TableBody emptyContent={"Không tìm thấy cửa hàng"} items={sortedItems}>
          {(item) => (
            <TableRow key={item._id} >
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {
        isOpenEditStatus && (
          <EditTourStatus
            isOpen={isOpenEditStatus}
            onClose={onCloseEditStatus}
            onOpenChange={onOpenChangeEditStatus}
            tourId={tourSelectedId}
          />
        )
      }
    </div>
  )
}
