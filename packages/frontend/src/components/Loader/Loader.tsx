import { Discuss } from "react-loader-spinner";
import "./Loader.css";

function Loader() {
  return (
    <div className="Loader">
      <Discuss
        visible={true}
        height="80"
        width="80"
        ariaLabel="comment-loading"
        colors={["#22e0ba", "#22e0ba"]}
        wrapperStyle={{}}
        wrapperClass="comment-wrapper"
      />
    </div>
  );
}

export default Loader;
