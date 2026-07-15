"use client";

import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

interface SelectedItem {
  selected: number;
}

export default function Pagination({
  pageCount,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const handlePageChange = ({ selected }: SelectedItem): void => {
    onPageChange(selected + 1);
  };

  return (
    <ReactPaginate
      className={css.pagination}
      pageCount={pageCount}
      forcePage={currentPage - 1}
      previousLabel="<"
      nextLabel=">"
      breakLabel="..."
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      onPageChange={handlePageChange}
      activeClassName={css.active}
    />
  );
}
