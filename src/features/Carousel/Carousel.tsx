import { useEffect, useRef } from "react";
import classNames from "classnames";

import { Button } from "@chakra-ui/react";

import useCurrentWeek from "/src/shared/hooks/useCurrentWeek";
import { useAppDispatch } from "/src/shared/hooks/useAppDispatch";
import {
  fetchScheduleByWeek,
  tableActions,
} from "/src/entities/ScheduleTable/model/slice/tableSlice";

import styles from "./Carousel.module.scss";
import { fetchVPKByWeek } from "/src/features/SelectVPK/model/slice/selectVPKSlice";
import { useSelector } from "react-redux";
import StateSchema from "/src/app/Providers/StoreProvider/config/StateSchema";
import { getSchedule } from "/src/entities/ScheduleTable/model/selectors/getSchedule";

interface CarouselProps {
  carouselItems: number[];
  group: string;
  week: number;
}

const Carousel = ({ carouselItems, group, week }: CarouselProps) => {
  const myRef = useRef<HTMLInputElement | HTMLButtonElement | null>(null);
  const { week: currentWeek } = useCurrentWeek();
  const dispatch = useAppDispatch();
  const schedule = useSelector(getSchedule);
  const vpkInfo = useSelector((state: StateSchema) => state.selectVPK.VPK);

  useEffect(() => {
    if (vpkInfo.group) {
      dispatch(fetchVPKByWeek({ week: currentWeek, vpk: vpkInfo }));
    }
  }, []);

  const executeScroll = () => {
    if (myRef.current !== null) {
      myRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fetchDataByWeek = async (week: number) => {
    await dispatch(fetchScheduleByWeek({ week, group }));
    if (vpkInfo.group) {
      await dispatch(fetchVPKByWeek({ week: currentWeek, vpk: vpkInfo }));
    }

    dispatch(tableActions.updateScheduleByNewVPKData(schedule));
  };

  useEffect(() => {
    setTimeout(() => executeScroll(), 500);
  }, []);

  return (
    <div className={classNames(styles.Carousel)}>
      {carouselItems.map((item, index) => {
        return (
          <Button
            className={styles.weekButton}
            onClick={() => fetchDataByWeek(item)}
            key={index}
            isDisabled={week === index + 1}
            // @ts-ignore
            ref={week === index + 1 ? myRef : null}
            backgroundColor={index + 1 === currentWeek ? "#5b32e2" : ""}
            opacity={item < currentWeek ? "0.5" : "1"}
            colorScheme={week === index + 1 ? "green" : "twitter"}
          >
            {item}
          </Button>
        );
      })}
    </div>
  );
};

export default Carousel;
