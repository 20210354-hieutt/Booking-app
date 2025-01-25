import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./NotFound.css";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
const NotFound = ({ place }) => {
  return (
    <div className="not-found-container">
      <FontAwesomeIcon icon={faMagnifyingGlass} className="not-found-icon" />
      <h1>No properties found in {place}</h1>
      <p>
        There are no matching properties for your search criteria. Try updating
        your search.
      </p>
    </div>
  );
};
export default NotFound;
