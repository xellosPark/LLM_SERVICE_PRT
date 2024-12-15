import React from "react";
import "./Pagination.css";

const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const numbersToShow = 10;
  let startPage = Math.max(currentPage - Math.floor(numbersToShow / 2), 1);
  let endPage = startPage + numbersToShow - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    // 정확한 수의 페이지 번호를 표시하기 위해 startPage를 조정합니다.
    startPage = Math.max(totalPages - numbersToShow + 1, 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination-container">
      <ul className="pagination">
        {/* 첫 페이지로 이동하는 버튼 */}
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            onClick={() => paginate(1)}
            disabled={currentPage === 1}
          >
            &laquo;
          </button>
        </li>
        {/* 이전 페이지로 이동하는 버튼 */}
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
        </li>
        {/* 페이지 번호들을 표시합니다. */}
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`page-item ${currentPage === number ? "active" : ""}`}
          >
            <button onClick={() => paginate(number)}>
              {number}
            </button>
          </li>
        ))}
        {/* 다음 페이지로 이동하는 버튼 */}
        <li
          className={`page-item ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </li>
        {/* 마지막 페이지로 이동하는 버튼 */}
        <li
          className={`page-item ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <button
            onClick={() => paginate(totalPages)}
            disabled={currentPage === totalPages}
          >
            &raquo;
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;