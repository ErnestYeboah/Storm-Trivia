import "../css/StartingPage.css";
import PlayButton from "./PlayButton";

const StartingPage = () => {
  return (
    <>
      <div className="starting_page">
        <div className="text_content">
          <h2 className="split-text-container">
            <span className="text-part left">Storm</span>{" "}
            <span className="text-part right">Trivia</span>
          </h2>
          <PlayButton name={"Play"} />
        </div>
      </div>
    </>
  );
};

export default StartingPage;
