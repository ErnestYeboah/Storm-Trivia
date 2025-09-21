import { IoArrowBackCircleOutline } from "react-icons/io5";

const DifficultySelectPage = ({
  onclick,
  closeDrawer,
}: {
  onclick: (name: string) => void;
  closeDrawer: () => void;
}) => {
  return (
    <div className="difficulty_selection_modal">
      <IoArrowBackCircleOutline
        onClick={closeDrawer}
        className="back_icon custom_back_icon"
      />
      <h2>Select your difficulty</h2>
      <button onClick={() => onclick("native")}>Native</button>
      <button onClick={() => onclick("student")}>Student</button>
      <button onClick={() => onclick("wise")}>Wise</button>
    </div>
  );
};

export default DifficultySelectPage;
