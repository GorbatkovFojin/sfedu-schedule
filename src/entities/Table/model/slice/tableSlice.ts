import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { defaultValue } from "/src/shared/const";
import { $api } from "/src/shared/api/api";
import { IChoices } from "/src/features/SearchSchedule";
import {
  IScheduleTable,
  ScheduleSchema,
} from "/src/entities/Table/model/types/Table";

export const fetchAndSaveUserGroup = createAsyncThunk(
  "schedule/fetchAndSaveUserGroup",
  async function (query: string, { rejectWithValue }) {
    if (query.trim() === "") return;
    try {
      const request = await $api.get("/", {
        params: {
          query,
        },
      });

      return request.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const fetchScheduleByQuery = createAsyncThunk(
  "schedule/fetchScheduleByQuery",
  async function (query: string, { rejectWithValue }) {
    if (query.trim() === "") return;
    try {
      const request = await $api.get("/", {
        params: {
          query,
        },
      });

      console.log(request.data);

      return request.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const fetchScheduleByGroup = createAsyncThunk(
  "schedule/fetchScheduleByGroup",
  async function (group: string, { rejectWithValue }) {
    try {
      const request = await $api.get("/", {
        params: {
          group,
        },
      });

      return request.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
    }
  },
);

interface IFetchScheduleByWeekProps {
  group: string;
  week: number;
}

export const fetchScheduleByWeek = createAsyncThunk(
  "schedule/fetchScheduleByWeek",
  async function (
    { group, week }: IFetchScheduleByWeekProps,
    { rejectWithValue },
  ) {
    try {
      const request = await $api.get("/", {
        params: {
          group,
          week,
        },
      });

      return request.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
    }
  },
);

/*const mergeVPKAndSchedule = (state) => {
  const vpkData = JSON.parse(localStorage.getItem("VPK_LOCALSTORAGE") || "{}");

  if (!("table" in vpkData)) return;

  const header = state.schedule.table.table.slice(0, 2);
  const slicedSchedule = state.schedule.table.table.slice(2);
  const slicedVPK = vpkData.table.table.slice(2);

  const mergedSchedule = slicedSchedule.map((row, rowIndex) => {
    return row.map((item, itemIndex) => {
      if (item.includes("Дисциплины ВПК")) {
        item = slicedVPK[rowIndex][itemIndex];
        return item;
      }
      return item;
    });
  });
  return header.concat(mergedSchedule);
};*/

const initialState: ScheduleSchema = {
  choices: null,
  schedule: defaultValue,
};

export const tableSlice = createSlice({
  name: "tableSlice",
  initialState,
  reducers: {
    setDefaultValue: (state) => {
      state.schedule = defaultValue;
      state.choices = null;
    },
    setSchedule: (state, action: PayloadAction<IScheduleTable>) => {
      state.schedule = action.payload;
      state.choices = null;
    },
    mergeScheduleAndVPK: (state, action: PayloadAction<any>) => {
      state.schedule.table.table = action.payload;
    },
    updateScheduleByNewVPKData: (state, action: PayloadAction<any>) => {
      const header = state.schedule.table.table.slice(0, 2);
      const slicedSchedule = state.schedule.table.table.slice(2);
      const slicedVPK = action.payload.table.table.slice(2);

      const mergedSchedule = slicedSchedule.map((row, rowIndex) => {
        return row.map((item, itemIndex) => {
          if (item.includes("Дисциплины ВПК")) {
            item = slicedVPK[rowIndex][itemIndex];
            return item;
          }
          return item;
        });
      });

      state.schedule.table.table = header.concat(mergedSchedule);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchScheduleByQuery.fulfilled,
        (state, action: PayloadAction<IScheduleTable | IChoices>) => {
          if (!action.payload) return;

          if ("choices" in action.payload) {
            state.choices = action.payload;
          } else {
            state.schedule = action.payload;
            state.choices = null;
            window.history.pushState(
              null,
              "group",
              `/?group=${action.payload.table.group}`,
            );
          }
        },
      )
      .addCase(
        fetchScheduleByGroup.fulfilled,
        (state, action: PayloadAction<IScheduleTable>) => {
          state.schedule = action.payload;
          state.choices = null;
          window.history.pushState(
            null,
            "group",
            `/?group=${action.payload.table.group}`,
          );
        },
      )
      .addCase(
        // Корень проблемы здесь
        fetchScheduleByWeek.fulfilled,
        (state, action: PayloadAction<IScheduleTable>) => {
          state.schedule = action.payload;
          state.choices = null;
          /*          state.schedule.table.table = mergeVPKAndSchedule(state);*/
        },
      );
  },
});

// Action creators are generated for each case reducer function
export const { actions: tableActions } = tableSlice;
export const { reducer: tableReducer } = tableSlice;
