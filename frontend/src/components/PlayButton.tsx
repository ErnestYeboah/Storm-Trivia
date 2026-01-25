import { memo, useEffect, useState } from "react";
import { Drawer } from "antd";
import DifficultySelectPage from "./DifficultySelectPage";
import NicknamePage from "./NicknamePage";
import { useDispatch, useSelector } from "react-redux";
import {
  getDifficulty,
  questionsData,
  showSettingsDeck,
} from "../features/QuestionSlice";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const PlayButton = ({ name = "Play" }: { name: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [childrenDrawer, setChildrenDrawer] = useState(false);
  const dispatch = useDispatch();
  const { settingsDeckView } = useSelector(questionsData);
  const [user_userChoice] = useCookies(["user_userChoice"]);
  const navigate = useNavigate();
  const path = location.pathname;

  const showDrawer = () => {
    if (user_userChoice["user_userChoice"]) {
      navigate("/question_tub");

      if (path == "/question_tub") {
        setOpen(true);
        dispatch(showSettingsDeck());
      }
    } else {
      setOpen(true);
      dispatch(showSettingsDeck());
    }
  };

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!settingsDeckView) {
      onClose();
      onChildrenDrawerClose();
    }
  }, [settingsDeckView]);

  const showChildrenDrawer = (difficulty: string) => {
    setChildrenDrawer(true);
    dispatch(getDifficulty(difficulty));
  };

  const onChildrenDrawerClose = () => {
    setChildrenDrawer(false);
  };

  const styles = {
    backdropFilter: "blur(10px)",
    backgroundColor: "rgba(255, 255, 255, 0)",
  };

  return (
    <>
      <button className="play__btn" onClick={showDrawer}>
        {name}
      </button>
      <Drawer
        style={styles}
        width={520}
        closable={false}
        onClose={onClose}
        open={open}
      >
        <DifficultySelectPage
          closeDrawer={() => setOpen(false)}
          onclick={showChildrenDrawer}
        />

        <Drawer
          style={styles}
          width={320}
          closable={false}
          onClose={onChildrenDrawerClose}
          open={childrenDrawer}
        >
          <NicknamePage />
        </Drawer>
      </Drawer>
    </>
  );
};

export default memo(PlayButton);
