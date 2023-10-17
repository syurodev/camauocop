"use client"
import React from 'react'
import { useDispatch } from 'react-redux'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip, getKeyValue, ChipProps } from "@nextui-org/react";
import { AiOutlineEye, AiOutlineEdit } from "react-icons/ai"
import { MdOutlineDelete } from "react-icons/md"

import { getShops } from '@/actions/admin'
import { useAppSelector } from '@/redux/store'
import { setShops } from '@/redux/features/shops-slice'
import { columns } from '@/lib/constant/ShopsTableColumns';

const Shops = () => {
  const dispatch = useDispatch()

  const session = useAppSelector(state => state.sessionReducer.value)
  const shops = useAppSelector(state => state.shopsReducer.value)

  React.useEffect(() => {
    const fetchShops = async () => {
      const res = await getShops(session?.user.accessToken!)
      if (res.code === 200) {
        dispatch(setShops(JSON.parse(res.data!)))
      }
    }

    if (session) {
      if (shops.length === 0) {
        fetchShops()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, shops])

  const statusColorMap: Record<string, ChipProps["color"]> = {
    active: "success",
    block: "danger",
  };

  const renderCell = React.useCallback((shops: IShopsResponse, columnKey: React.Key) => {
    const cellValue = shops[columnKey as keyof IShopsResponse];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: shops.image }}
            description={shops.username}
            name={cellValue}
          >
            {shops.name}
          </User>
        );
      case "address":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize text-default-400">{shops.address}</p>
          </div>
        );
      case "status":
        return (
          <Chip className="capitalize" color={statusColorMap[shops.status]} size="sm" variant="flat">
            {shops.status === "active" ? "Hoạt động" : "Bị khoá"}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Details">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <AiOutlineEye />
              </span>
            </Tooltip>
            <Tooltip content="Edit user">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <AiOutlineEdit />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <MdOutlineDelete />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    shops && shops.length > 0 && (
      <Table aria-label="Example table with custom cells">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={shops}>
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    )
  )
}

export default Shops