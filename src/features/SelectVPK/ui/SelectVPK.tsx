import { memo, useEffect, useMemo } from "react";

import { Button, Heading, useToast } from "@chakra-ui/react";
import { IVPK } from "/src/features/SelectVPK/model/types/VPK";
import useCurrentWeek from "/src/shared/hooks/useCurrentWeek";
import { useSelector } from "react-redux";
import { getSchedule } from "/src/entities/ScheduleTable/model/selectors/getSchedule";
import { useAppDispatch } from "/src/shared/hooks/useAppDispatch";
import {
  fetchVPK,
  fetchVPKByWeek,
  selectVPKActions,
} from "/src/features/SelectVPK/model/slice/selectVPKSlice";
import StateSchema from "/src/app/Providers/StoreProvider/config/StateSchema";
import { tableActions } from "/src/entities/ScheduleTable/model/slice/tableSlice";

import styles from "./SelectVPK.module.scss";
import { VPKSort } from "/src/shared/lib/vpkSort";
import {
  SELECT_VPK_ERROR,
  VPK_SELECTED_SUCCESSFULLY,
} from "/src/shared/const/toast/toast";

const SelectVPK = memo(() => {
  const toast = useToast();
  const { week } = useCurrentWeek();

  const dispatch = useAppDispatch();
  const schedule = useSelector(getSchedule).schedule;
  const VPKList = useSelector((state: StateSchema) => state.selectVPK.choices);
  const VPKInfo = useSelector((state: StateSchema) => state.selectVPK.VPK);
  const VPKData = useSelector((state: StateSchema) => state.selectVPK.VPKData);

  const filteredVPKList = useMemo(() => {
    return [...VPKList].sort(VPKSort);
  }, [VPKList]);

  useEffect(() => {
    dispatch(fetchVPK());
  }, []);

  const updateData = async () => {
    const header = schedule.table.table.slice(0, 2);
    const slicedSchedule = schedule.table.table.slice(2);
    const slicedVPK = VPKData.table.table.slice(2);

    const mergedSchedule = slicedSchedule.map((row, rowIndex) => {
      return row.map((item, itemIndex) => {
        if (item.includes("Дисциплины ВПК")) {
          item = slicedVPK[rowIndex][itemIndex];
          return item;
        }
        return item;
      });
    });

    dispatch(tableActions.mergeScheduleAndVPK(header.concat(mergedSchedule)));
  };

  useEffect(() => {
    updateData();
  }, [fetchVPKByWeek]);

  async function setVPK(vpk: IVPK) {
    try {
      dispatch(selectVPKActions.setVPK(vpk));
      await dispatch(fetchVPKByWeek({ vpk, week }));
      toast(VPK_SELECTED_SUCCESSFULLY);
    } catch (error) {
      toast(SELECT_VPK_ERROR);
    }
  }

  return (
    <div className={styles.SelectVPK}>
      <Heading as="h3" size="md">
        Установите группу ВПК
      </Heading>
      <div className={styles.vpkList}>
        {filteredVPKList.map((item, index) => (
          <Button
            key={index}
            onClick={() => setVPK(item)}
            isDisabled={item.name === VPKInfo.name}
          >
            {item.name}
          </Button>
        ))}
      </div>
    </div>
  );
});

export default SelectVPK;
