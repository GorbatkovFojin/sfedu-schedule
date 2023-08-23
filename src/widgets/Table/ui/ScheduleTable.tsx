import { memo } from "react";

import classNames from "classnames";
import {
  Button,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import TableCell from "/src/widgets/Table/ui/TableCell/TableCell";

import { $api } from "/src/shared/api/api";
import { IScheduleTable } from "/src/entities/ScheduleTable";

import styles from "./ScheduleTable.module.scss";

interface TableProps {
  className?: string;
  schedule: IScheduleTable;
  updateData: (data: IScheduleTable) => void;
}

export const ScheduleTable = memo(
  ({ className, schedule, updateData }: TableProps) => {
    const textColor = useColorModeValue("black", "white");

    async function fetchDataByWeek(week: number) {
      try {
        const request = await $api.get("/", {
          params: {
            group: schedule.table.group,
            week,
          },
        });

        updateData(request.data);
      } catch (error) {
        console.log(error);
      }
    }

    if (schedule.result === "no_entries") return null;

    return (
      <div className={classNames(styles.Table, {}, [className])}>
        {schedule && (
          <>
            {schedule.table.name && (
              <Heading color="white" className={styles.tableTitle}>
                Расписание {schedule.table.name}
              </Heading>
            )}
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                padding: "1em 0",
              }}
            >
              {schedule.weeks.map((week, index) => {
                return (
                  <Button
                    className={styles.weekButton}
                    onClick={() => fetchDataByWeek(week)}
                    key={index}
                    isDisabled={schedule.table.week === index + 1}
                    opacity={schedule.table.week > index ? "0.5" : "1"}
                    colorScheme={
                      schedule.table.week === index + 1 ? "green" : "twitter"
                    }
                  >
                    {week}
                  </Button>
                );
              })}
            </div>
            <TableContainer sx={{ height: "100%", overflowY: "auto" }}>
              <Table variant="simple" sx={{ color: textColor }}>
                <Thead
                  sx={{
                    position: "sticky",
                    top: 0,
                    background: "#262D3F",
                    zIndex: 1,
                    color: "white",
                  }}
                >
                  {schedule.table.table.slice(0, 2).map((row, index) => {
                    return (
                      <Tr key={index}>
                        {row.map((element, index) => {
                          return <Td key={index}>{element}</Td>;
                        })}
                      </Tr>
                    );
                  })}
                </Thead>
                <Tbody className={styles.tableBody}>
                  {schedule.table.table.slice(2).map((row, index) => {
                    return (
                      <Tr key={index}>
                        {row.map((element, index) => {
                          return (
                            <TableCell
                              key={index}
                              element={element}
                              textColor={textColor}
                            />
                          );
                        })}
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </>
        )}
      </div>
    );
  },
);
