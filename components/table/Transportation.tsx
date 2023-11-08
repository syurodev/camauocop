"use client"

import React from 'react'
import { useDispatch } from "react-redux"
import toast from 'react-hot-toast'
import { AiOutlineSearch, AiOutlineEdit, AiOutlinePlus } from "react-icons/ai"
import { Button, Input, Pagination, Selection, SortDescriptor, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from '@nextui-org/react'

import { getTransportation } from '@/actions/tourisms'
import { useAppSelector } from '@/redux/store'
import { TransportationColum } from '@/lib/constant/TransportationColum'
import { setTransportations } from '@/redux/features/transportation-slice'
import AddTransportation from '../form/AddTransportation'

const INITIAL_VISIBLE_COLUMNS = ["Tên", "Số tour sử dụng", "Thao tác"];

const Transportation: React.FC = () => {

  const dispatch = useDispatch()
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { isOpen: isOpenEdit, onOpen: onOpenEdit, onOpenChange: onOpenChangeEdit, onClose: onCloseEdit } = useDisclosure();
  const [destinationSelected, setDestinationSelected] = React.useState<string>("")
  const [page, setPage] = React.useState(1);
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [rowsPerPage, setRowsPerPage] = React.useState(10); const [filterValue, setFilterValue] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "count",
    direction: "ascending",
  });

  // GET DATA
  React.useEffect(() => {
    const fetchApi = async () => {
      const res = await getTransportation()
      if (res.code === 200) {
        dispatch(setTransportations(res.data!))
      } else {
        toast.error(res.message)
      }
    }
    fetchApi()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const columns = TransportationColum

  const transportations: TransportationData[] = useAppSelector(state => state.transportationReducer.value)
  const session = useAppSelector((state) => state.sessionReducer.value)
  const pages = Math.ceil(transportations.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredAds = [...transportations];

    if (hasSearchFilter) {
      filteredAds = filteredAds.filter((destination) =>
        destination?.name.includes(filterValue),
      );
    }
    return filteredAds;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transportations, filterValue, statusFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: TransportationData, b: TransportationData) => {
      const first = a[sortDescriptor.column as keyof TransportationData];
      const second = b[sortDescriptor.column as keyof TransportationData];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((transportation: TransportationData, columnKey: React.Key) => {
    const cellValue = transportation[columnKey as keyof TransportationData];
    switch (columnKey) {
      case "name":
        return (
          <div className='min-w-[250px]'>
            <p className="text-bold text-small capitalize">{transportation.name}</p>
          </div>
        );
      case "tourCount":
        return (
          <div className='flex flex-row gap-3'>
            <p className="text-bold text-small capitalize">{transportation.tourCount}</p>
          </div>
        );
      case "description":
        return (
          <div className='min-w-[250px]'>
            <p className="text-bold text-small capitalize">{transportation.description || "Không có"}</p>
          </div>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            {/* <Tooltip content="Xem chi tiết">
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                radius="full"
                className="border-none"
                onPress={() => {
                  setAdsSelected(ads._id)
                  // onOpenOrderDetail()
                }}>
                <AiOutlineEye />
              </Button>
            </Tooltip> */}

            {
              session?.user.role === "admin" && (
                <Button
                  isIconOnly
                  size="sm"
                  variant="ghost"
                  radius="full"
                  className="border-none"
                  onPress={() => {
                    setDestinationSelected(transportation._id)
                    onOpenEdit()
                  }}
                >
                  <AiOutlineEdit />
                </Button>
              )
            }
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
            placeholder="Nhập tên phương tiện muốn tìm"
            size="sm"
            startContent={<AiOutlineSearch className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Button
              className="bg-foreground text-background"
              endContent={<AiOutlinePlus />}
              size="sm"
              onPress={onOpen}
            >
              Thêm phương tiện
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Hiện có {transportations.length} địa điểm</span>
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
    transportations.length,
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
        aria-label="Bảng địa điểm"
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
        <TableBody emptyContent={"Không tìm thấy địa điểm"} items={sortedItems}>
          {(item) => (
            <TableRow key={item._id} >
              {(columnKey) => <TableCell>{
                renderCell(item, columnKey)
              }</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {
        isOpen && (
          <AddTransportation
            isOpen={isOpen}
            onClose={onClose}
            onOpenChange={onOpenChange}
          />
        )
      }
    </div>
  )
}

export default Transportation