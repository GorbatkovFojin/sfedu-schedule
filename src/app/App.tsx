import { Suspense, useState } from "react";

import { Header } from "/src/widgets/Header";
import { ScheduleTable } from "/src/entities/Table";
import { SearchSchedule } from "/src/features/SearchSchedule";
import { ScheduleCardsList } from "/src/widgets/ScheduleCardsList";
import Loader from "/src/shared/ui/Loader/Loader";
import MainColumns from "/src/shared/ui/MainColumns/MainColumns";
import { Calendar } from "/src/widgets/Calendar";
import { UpcomingLessons } from "/src/widgets/UpcomingLessons";
import { Box, Button } from "@chakra-ui/react";
import { SelectVPK } from "/src/features/SelectVPK";

const isUserOnline = navigator.onLine;

console.log(isUserOnline);

function App() {
  const [showVPKGroups, setShowVPKGroups] = useState(false);

  /*  const updateData = (data: IScheduleTable) => {
    setFinishedTable(data);
  };

  useEffect(() => {
    const userGroup = JSON.parse(localStorage.getItem(USER_GROUP) || "{}");

    if (
      finishedTable.table?.name === userGroup.name &&
      finishedTable.table?.week === week
    ) {
      localStorage.setItem(SAVED_SCHEDULE, JSON.stringify(finishedTable));
    }
  }, [updateData]);*/

  /*  useEffect(() => {
    const savedSchedule = JSON.parse(
      localStorage.getItem(SAVED_SCHEDULE) || "{}",
    );

    if (Object.keys(savedSchedule).length === 0) return;

    if (savedSchedule) {
      setFinishedTable(savedSchedule);
    }

    if (!isUserOnline) {
      toast({
        title: "Нет интернета!",
        description: "Показано сохраненное расписание вашей группы :)",
        status: "warning",
        duration: 6000,
        isClosable: true,
      });
    }
  }, []);
*/
  const renderTableByViewPort = () => {
    if (window.screen.width > 768) return <ScheduleTable />;
    return <ScheduleCardsList />;
  };

  const renderColumnsByViewPort = () => {
    if (window.screen.width > 768)
      return (
        <MainColumns>
          <SearchSchedule />
          <Calendar />
          <UpcomingLessons />
        </MainColumns>
      );
    return <SearchSchedule />;
  };

  return (
    <Suspense fallback={<Loader />}>
      <div className="App">
        <Header />
        {renderColumnsByViewPort()}
        {renderTableByViewPort()}

        {!showVPKGroups && (
          <Box
            sx={{ display: "flex", justifyContent: "center", margin: "1em" }}
          >
            <Button sx={{ m: 2 }} onClick={() => setShowVPKGroups(true)}>
              Выбрать ВПК
            </Button>
          </Box>
        )}
        <Suspense fallback={<Loader />}>
          {showVPKGroups && <SelectVPK />}
        </Suspense>
      </div>
    </Suspense>
  );
}

export default App;
