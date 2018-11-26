import React from "react";
import SearchResult from "./SearchResult";
import PropTypes from "prop-types";

const AllResults = ({ books }) => {
  return (
    <div className="row">
      {books.map(book => (
        <SearchResult bookData={book} key={book.id} />
      ))}
    </div>
  );
};

AllResults.propTypes = {
  books: PropTypes.array
};

export default AllResults;
