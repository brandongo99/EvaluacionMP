import { React, useState } from 'react';
import { Pagination } from 'react-bootstrap';
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'react-feather';
import './Pagination.css';

const PaginatedComponent = ({ data, itemsPerPage, renderItems }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Fución para renderizar los números de página con lógica de elipsis
    const renderPaginationItems = () => {
        const pageNumbers = [];
        const maxVisiblePages = 3;
        let startPage, endPage;

        if (totalPages <= maxVisiblePages) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if (currentPage <= 2) {
                startPage = 1;
                endPage = maxVisiblePages;
            } else if (currentPage + 1 >= totalPages) {
                startPage = totalPages - maxVisiblePages + 1;
                endPage = totalPages;
            } else {
                startPage = currentPage - 1;
                endPage = currentPage + 1;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <Pagination.Item key={i} active={i === currentPage} onClick={() => handlePageChange(i)}>
                    {i}
                </Pagination.Item>
            );
        }

        if (startPage > 1) {
            pageNumbers.unshift(<Pagination.Ellipsis key="start-ellipsis" />);
        }
        if (endPage < totalPages) {
            pageNumbers.push(<Pagination.Ellipsis key="end-ellipsis" />);
        }

        return pageNumbers;
    };

    return (
        <>
            {renderItems(currentItems)}
            <Pagination>
                <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
                    <ChevronsLeft size="18px" />
                </Pagination.First>
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    <ChevronLeft size="18px" />
                </Pagination.Prev>
                {renderPaginationItems()}
                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    <ChevronRight size="18px" />
                </Pagination.Next>
                <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
                    <ChevronsRight size="18px" />
                </Pagination.Last>
            </Pagination>
        </>
    );
};

export default PaginatedComponent;
