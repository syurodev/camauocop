"use client"
import React from 'react'
import { useDispatch } from "react-redux";
import { Avatar, Button, Chip, ChipProps, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Pagination, Selection, SortDescriptor, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, useDisclosure, Textarea, Spinner, Select, SelectItem } from '@nextui-org/react';
import { BsThreeDotsVertical } from "react-icons/bs"
import { AiOutlineSearch, AiOutlineEye, AiOutlineEdit, AiOutlinePlus } from "react-icons/ai"
import toast from 'react-hot-toast';

import { useAppSelector } from '@/redux/store';
import { AdvertisementColums } from '@/lib/constant/AdvertisementColum';
import { changeAdvertisementStatus, createAdvertisement, getAdvertisement } from '@/actions/advertisement';
import { pushAd, setAds, updateAdsStatus } from '@/redux/features/ads-slice';
import { formatDate } from '@/lib/formatDate';
import { capitalize } from "@/lib/utils";
import { UploadButton, UploadDropzone } from '@/lib/uploadthing';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { AdvertisementSchema, IAdvertisementSchema } from '@/lib/zodSchema/advertisementSchema';

const statusColorMap: Record<string, ChipProps["color"]> = {
  waiting: "warning",
  accept: "success",
  running: "success",
  stopped: "default",
  refused: "danger",
};

const statusOptions = [
  { name: "Đang chờ", uid: "waiting" },
  { name: "Đã chấp nhận", uid: "accept" },
  { name: "Bị từ chối", uid: "refused" },
  { name: "Đang chạy", uid: "running" },
  { name: "Đã kết thúc", uid: "stopped" },
];

const INITIAL_VISIBLE_COLUMNS = ["Hình ảnh", "Ngày đăng ký", "Trạng thái", "Ngày bắt đầu", "Ngày kết thúc", "Thao tác"];

export default function Advertisement() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { isOpen: isOpenEdit, onOpen: onOpenEdit, onOpenChange: onOpenChangeEdit, onClose: onCloseEdit } = useDisclosure();
  const [page, setPage] = React.useState(1);
  const [adsImage, setAdsImage] = React.useState("");
  const [filterValue, setFilterValue] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));

  const [adsSelected, setAdsSelected] = React.useState<string>("")
  const [statusSelected, setStatusSelected] = React.useState(new Set(["accept"]))
  const [note, setNote] = React.useState<string>("")
  const [isSubmitChange, setIsSubmitChange] = React.useState<boolean>(false)

  const [isSubmit, setIsSubmit] = React.useState<boolean>(false)
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "startDate",
    direction: "ascending",
  });

  const dispatch = useDispatch()
  const session = useAppSelector((state) => state.sessionReducer.value)
  const columns = AdvertisementColums
  // const {
  //   register,
  //   handleSubmit,
  //   setValue,
  //   formState: { errors },
  // } = useForm<IAdvertisementSchema>({
  //   defaultValues: {
  //     shopId: session?.user.shopId,
  //     note: "",
  //     type: "public",
  //     status: "public",
  //   },
  //   resolver: zodResolver(AdvertisementSchema),
  // })

  //GET DATA
  React.useEffect(() => {
    const fetchApi = async () => {
      const res = await getAdvertisement({})
      if (res.code === 200) {
        dispatch(setAds(res.data!))
      }
    }
    if (session) {
      fetchApi()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  const adsData = useAppSelector(state => state.adsReducer.value)
  const pages = Math.ceil(adsData.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredAds = [...adsData];

    if (hasSearchFilter) {
      filteredAds = filteredAds.filter((ads) =>
        ads?.startDate.includes(filterValue),
      );
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredAds = filteredAds.filter((ads) =>
        Array.from(statusFilter).includes(ads.status),
      );
    }

    return filteredAds;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adsData, filterValue, statusFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: Ads, b: Ads) => {
      const first = a[sortDescriptor.column as keyof Ads] as string;
      const second = b[sortDescriptor.column as keyof Ads] as string;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((ads: Ads, columnKey: React.Key) => {
    const cellValue = ads[columnKey as keyof Ads];

    switch (columnKey) {
      case "image":
        return (
          <Avatar src={cellValue} />
        );
      case "type":
        return (
          <Chip className="capitalize select-none pointer-events-none" color={ads.type === 'home' ? "secondary" : "primary"} size="sm" variant="flat">
            {ads.type === "home" ? "Cửa hàng" : "Hệ thống"}
          </Chip>
        );
      case "dateCreate":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{formatDate(ads.createdAt)}</p>
            {/* <p className="text-bold text-tiny capitalize text-default-500">{shop.address}</p> */}
          </div>
        );
      case "status":
        return (
          <Chip className="capitalize select-none pointer-events-none" color={statusColorMap[ads.status]} size="sm" variant="flat">
            {ads.status === "waiting" ? "Đang chờ" : ads.status === "accept" ? "Đã chấp nhận" : ads.status === "refused" ? "Bị từ chối"
              : ads.status === "running" ? "Đang chạy" : "Đã kết thúc"
            }
          </Chip>
        );
      case "startDate":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{formatDate(ads.startDate)}</p>
            {/* <p className="text-bold text-tiny capitalize text-default-500">{shop.address}</p> */}
          </div>
        );
      case "endDate":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{formatDate(ads.endDate)}</p>
            {/* <p className="text-bold text-tiny capitalize text-default-500">{shop.address}</p> */}
          </div>
        );
      case "note":
        return (
          <div className="flex flex-col m-w-[300px]">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            {/* <p className="text-bold text-tiny capitalize text-default-500">{shop.address}</p> */}
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
                    setAdsSelected(ads._id)
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
            placeholder="Nhập ngày bắt đầu quảng cáo muốn tìm"
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
              <DropdownTrigger>
                <Button
                  endContent={<BsThreeDotsVertical className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Cột
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
            <Button
              className="bg-foreground text-background"
              endContent={<AiOutlinePlus />}
              size="sm"
              onPress={onOpen}
            >
              Thêm quảng cáo
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Hiện có {adsData.length} quảng cáo</span>
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
    adsData.length,
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

  // console.log(errors)

  // const onSubmit = async (data: IAdvertisementSchema) => {
  //   const startD = new Date(data.startDate).toISOString().substr(0, 10)
  //   const currentDate = new Date().toISOString().substr(0, 10)
  //   setIsSubmit(true)

  //   const status = function () {
  //     if (startD === currentDate) {
  //       return "running"
  //     } else {
  //       return "accept"
  //     }
  //   }
  //   const res = await createAdvertisement(session?.user.accessToken!, {
  //     ...data,
  //     status: status()
  //   })
  //   if (res.code === 200) {
  //     toast.success(res.message)
  //     dispatch(pushAd(res.data!))
  //     onClose()
  //   } else {
  //     toast.error(res.message)
  //   }
  //   setIsSubmit(false)
  // }

  const handleChangeStatus = async () => {
    const res = await changeAdvertisementStatus(
      session?.user.accessToken!,
      Array.from(statusSelected)[0].toString() as AdvertisementStatus,
      note,
      adsSelected
    )

    if (res.code === 200) {
      toast.success(res.message)
      onCloseEdit()
      dispatch(updateAdsStatus({
        adsId: adsSelected,
        newStatus: Array.from(statusSelected)[0].toString() as AdvertisementStatus,
        note,
      }))
    } else {
      toast.error(res.message)
    }
  }

  return (
    <div>
      <Table
        isCompact
        // removeWrapper
        aria-label="Bảng quảng cáo"
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
        <TableBody emptyContent={"Không tìm thấy quảng cáo"} items={sortedItems}>
          {(item) => (
            <TableRow key={item._id} >
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* {
        isOpen && (
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size='4xl'
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">Thêm quảng cáo</ModalHeader>
                    <ModalBody>
                      {adsImage ? (
                        <div className='flex flex-col items-center justify-center gap-3'>
                          <div className="h-fit min-h-[200px] w-fit max-w-full min-w-[200px] rounded-md border !overflow-visible relative">
                            <Image
                              alt="Upload"
                              src={adsImage}
                              width="100%"
                              className="object-cover w-auto h-[300px]"
                              radius='md'
                            />
                          </div>
                          <UploadButton
                            endpoint={'advertisementImage'}
                            onClientUploadComplete={(res) => {
                              if (res) {
                                setAdsImage(res[0].url);
                                setValue("image", res[0].url)
                              }
                            }}
                            onUploadError={(error: Error) => {
                              console.log(error);
                            }}
                          />
                        </div>
                      ) : (
                        <UploadDropzone
                          endpoint={'advertisementImage'}
                          onClientUploadComplete={(res) => {
                            if (res) {
                              setAdsImage(res[0].url);
                              setValue("image", res[0].url)
                            }
                          }}
                          onUploadError={(error: Error) => {
                            console.log(error);
                          }}
                        />
                      )}
                      {
                        !!errors.image && (
                          <span className='text-rose-500'>{errors.image.message}</span>
                        )
                      }

                      <Input
                        isRequired
                        label="Chọn ngày bắt đầu"
                        placeholder='12/12/2023'
                        type='date'
                        {...register("startDate")}
                        isInvalid={!!errors.startDate}
                        errorMessage={errors.startDate?.message}
                      />

                      <Input
                        isRequired
                        placeholder='22/12/2023'
                        label="Chọn ngày kết thúc"
                        type='date'
                        {...register("endDate")}
                        isInvalid={!!errors.endDate}
                        errorMessage={errors.endDate?.message}
                      />

                      <Select
                        isRequired
                        label="Loại quảng cáo"
                        placeholder="Chọn loại quảng cáo"
                        defaultSelectedKeys={["public"]}
                        className="max-w-full"
                        {...register("type")}
                        isInvalid={!!errors.type}
                        errorMessage={errors.type?.message}
                      >
                        <SelectItem key="public" value="public">
                          Trên trang chủ của hệ thống
                        </SelectItem>
                      </Select>

                      <Textarea
                        label="Ghi chú"
                        labelPlacement="inside"
                        placeholder="Nhập ghi chú của bạn"
                        className="max-w-full"
                        {...register("note")}
                        isInvalid={!!errors.note}
                        errorMessage={errors.note?.message}
                      />
                    </ModalBody>
                    <ModalFooter>
                      <Button variant="flat" onPress={onClose}>
                        Huỷ
                      </Button>
                      <Button color="success" type='submit' isDisabled={isSubmit}>
                        {
                          isSubmit && <Spinner size='sm' />
                        }
                        Thêm
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </form>
          </Modal>
        )
      } */}

      {
        isOpenEdit && (
          <Modal
            isOpen={isOpenEdit}
            onOpenChange={onOpenChangeEdit}
            size='3xl'
          >
            <ModalContent>
              {(onCloseEdit) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">Thêm quảng cáo</ModalHeader>
                  <ModalBody>
                    <Select
                      isRequired
                      label="Trạng thái quảng cáo"
                      placeholder="Chọn trạng thái quảng cáo"
                      defaultSelectedKeys={["accept"]}
                      className="max-w-full"
                      selectedKeys={statusSelected}
                      onSelectionChange={(key) => {
                        const value = Array.from(key)[0].toString()
                        setStatusSelected(new Set([value]))
                      }}
                    >
                      <SelectItem key="accept" value="accept">
                        Chấp thuận
                      </SelectItem>
                      <SelectItem key="refused" value="refused">
                        Từ chối
                      </SelectItem>
                    </Select>

                    <Textarea
                      isRequired={Array.from(statusSelected)[0].toString() === "refused"}
                      label="Ghi chú"
                      labelPlacement="inside"
                      placeholder="Nhập ghi chú của bạn"
                      className="max-w-full"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button variant="flat" onPress={onCloseEdit}>
                      Huỷ
                    </Button>
                    <Button color="success" isDisabled={isSubmitChange} onPress={handleChangeStatus}>
                      {
                        isSubmitChange && <Spinner size='sm' />
                      }
                      Thêm
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        )
      }
    </div>
  )
}
