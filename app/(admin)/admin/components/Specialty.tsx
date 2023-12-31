"use client"

import React from 'react'
import { useDispatch } from "react-redux"
import toast from 'react-hot-toast'
import { AiOutlineSearch, AiOutlineEdit, AiOutlinePlus } from "react-icons/ai"
import { Avatar, Button, Input, Pagination, Selection, SortDescriptor, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from '@nextui-org/react'

import { useAppSelector } from '@/redux/store'
import { getSpecialtys } from '@/actions/specialty'
import { setSpecialtys } from '@/redux/features/specialtys-slice'
import { SpecialtysColumns } from '@/lib/constant/SpecialtysColumns'
import AddSpecialty from '@/components/form/AddSpecialty'

const INITIAL_VISIBLE_COLUMNS = ["Tên", "Hình ảnh", "Số lượng sản phẩm", "Mô tả", "Thao tác"];

const Specialty: React.FC = () => {
  const dispatch = useDispatch()
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { isOpen: isOpenEdit, onOpen: onOpenEdit, onOpenChange: onOpenChangeEdit, onClose: onCloseEdit } = useDisclosure();
  const [specialtySelected, setDestinationSelected] = React.useState<string>("")
  const [page, setPage] = React.useState(1);
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [rowsPerPage, setRowsPerPage] = React.useState(10); const [filterValue, setFilterValue] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "productCount",
    direction: "descending",
  });

  // GET DATA
  React.useEffect(() => {
    const fetchApi = async () => {
      const res = await getSpecialtys()
      if (res.code === 200) {
        dispatch(setSpecialtys(res.data!))
      } else {
        toast.error(res.message)
      }
    }
    fetchApi()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const columns = SpecialtysColumns

  const specialtys: SpecialtysData[] = useAppSelector(state => state.specialtysReducer.value)
  const session = useAppSelector((state) => state.sessionReducer.value)
  const pages = Math.ceil(specialtys.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredAds = [...specialtys];

    if (hasSearchFilter) {
      filteredAds = filteredAds.filter((specialty) =>
        specialty?.name.includes(filterValue),
      );
    }
    return filteredAds;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specialtys, filterValue, statusFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: SpecialtysData, b: SpecialtysData) => {
      const first = a[sortDescriptor.column as keyof SpecialtysData];
      const second = b[sortDescriptor.column as keyof SpecialtysData];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((specialty: SpecialtysData, columnKey: React.Key) => {
    const cellValue = specialty[columnKey as keyof SpecialtysData];
    switch (columnKey) {
      case "name":
        return (
          <div className='min-w-[250px]'>
            <p className="text-bold text-small capitalize">{specialty.name}</p>
          </div>
        );
      case "images":
        return (
          <div className='flex flex-row gap-3'>
            {specialty.images.map((image, index) => (
              <Avatar key={index} src={image} />
            ))}
          </div>
        );
      case "productCount":
        return (
          <div className='min-w-[250px]'>
            <p className="text-bold text-small capitalize">{specialty.productCount}</p>
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
                    setDestinationSelected(specialty._id)
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
            placeholder="Nhập tên đặc sản muốn tìm"
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
              Thêm đặc sản
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Hiện có {specialtys.length} đặc sản</span>
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
    specialtys.length,
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
          <AddSpecialty
            isOpen={isOpen}
            onClose={onClose}
            onOpenChange={onOpenChange}
          />
        )
      }
    </div>
  )
}

export default React.memo(Specialty)