import { ButtonHTMLAttributes, memo } from "react";

import {
  Button,
  Heading,
  IconButton,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";

import { TOAST_SEARCH_REMOVED } from "/src/shared/const/toast/toast";
import { useAppDispatch } from "/src/shared/hooks/useAppDispatch";
import { favoriteSearchActions } from "/src/entities/ScheduleTable/model/slice/favoriteSearchSlice";

import styles from "./FavoriteChoice.module.scss";

type FavoriteChoiceProps = {
  className?: string;
  title: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const FavoriteChoice = memo(
  ({ title, onClick }: FavoriteChoiceProps) => {
    const { colorMode } = useColorMode();
    const dispatch = useAppDispatch();
    const toast = useToast();
    const handleRemoveFavorite = async () => {
      dispatch(favoriteSearchActions.removeSearchFromFavorite(title));
      toast(TOAST_SEARCH_REMOVED);
    };

    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <Button
          type="reset"
          className={styles.FavoriteChoice}
          onClick={onClick}
          sx={{ justifyContent: "flex-start" }}
        >
          <Heading size="md" color={colorMode}>
            {title}
          </Heading>
        </Button>
        <IconButton aria-label="Избранный поиск" onClick={handleRemoveFavorite}>
          <StarIcon color="yellow" />
        </IconButton>
      </div>
    );
  },
);
