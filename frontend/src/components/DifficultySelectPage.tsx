const DifficultySelectPage = ({
  onclick,
}: {
  onclick: (name: string) => void;
}) => {
  return (
    <div className="difficulty_selection_modal">
      <h2>Select your difficulty</h2>
      <button onClick={() => onclick("native")}>Native</button>
      <button onClick={() => onclick("student")}>Student</button>
      <button onClick={() => onclick("wise")}>Wise</button>
    </div>
  );
};

export default DifficultySelectPage;
