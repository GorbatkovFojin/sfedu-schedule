import { Suspense, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { Header } from "/src/widgets/Header";
import { ScheduleTable } from "/src/entities/ScheduleTable";
import { SearchSchedule } from "/src/features/SearchSchedule";
import Loader from "/src/shared/ui/Loader/Loader";
import MainColumns from "/src/shared/ui/MainColumns/MainColumns";
import { Calendar } from "/src/entities/Calendar";
import { ShowVPK } from "/src/widgets/ShowVPK";
import { ScheduleCardsList } from "/src/widgets/ScheduleCardsList";
import { UpcomingLessons } from "/src/entities/UpcomingLessons";
import { useToast } from "@chakra-ui/react";
import { TOAST_NO_INTERNET } from "/src/shared/const/toast/toast";
import { SAVED_SCHEDULE } from "/src/shared/const/localStorage/localStorageKeys";
import { useAppDispatch } from "/src/shared/hooks/useAppDispatch";
import { tableActions } from "/src/entities/ScheduleTable/model/slice/tableSlice";
import { IScheduleTable } from "/src/entities/ScheduleTable/model/types/Table";
import { useFetchGroupQuery } from "/src/features/SearchSchedule/api";

const isUserOnline = navigator.onLine;

const App = () => {
  const toast = useToast();
  const dispatch = useAppDispatch();
  const [queryParameters] = useSearchParams();
  const { data } = useFetchGroupQuery(queryParameters.get("group") || "");

  useEffect(() => {
    if (data?.table?.group) {
      dispatch(tableActions.setSchedule(data));
    }
  }, [data]);

  const savedUserSchedule = JSON.parse(
    localStorage.getItem(SAVED_SCHEDULE) || "{}",
  ) as IScheduleTable;

  const renderColumnsByViewPort = () => {
    if (window.screen.width > 768)
      return (
        <MainColumns>
          <Calendar />
          <SearchSchedule />
          <UpcomingLessons />
        </MainColumns>
      );
    return <SearchSchedule />;
  };

  useEffect(() => {
    if (!isUserOnline) {
      toast(TOAST_NO_INTERNET);
      if (savedUserSchedule?.table?.group) {
        dispatch(tableActions.setSchedule(savedUserSchedule));
      }
    }
  }, []);

  return (
    <Suspense fallback={<Loader />}>
      <div className="App">
        <Header />
        {renderColumnsByViewPort()}
        {window.screen.width > 768 ? <ScheduleTable /> : <ScheduleCardsList />}
        <ShowVPK />
      </div>
    </Suspense>
  );
};

export default App;
