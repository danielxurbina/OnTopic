import React from "react"
import { Pagination } from "react-bootstrap"

const PaginationComponent = ({ postsPerPage, length, currentPage, handlePagination, handleNext, handlePrev }) => {
    const paginationNumbers = []

    for(let i = 1; i <= Math.ceil(length / postsPerPage); i++){
        paginationNumbers.push(i)
    }

    return (
        <div>
            <Pagination>
                <Pagination.Prev 
                    onClick={handlePrev} 
                    disabled={currentPage === 0 ? true : false} 
                />
                {paginationNumbers.map((pageNumber) => {
                    return (
                        <Pagination.Item 
                            key={pageNumber}
                            active={currentPage + 1 === pageNumber ? 'active' : ''}
                            onClick={() => handlePagination(pageNumber)}
                        >
                            {pageNumber}
                        </Pagination.Item>
                    )
                })}
                <Pagination.Next 
                    onClick={handleNext} 
                    disabled={currentPage === paginationNumbers.length - 1 ? true : false} 
                />
            </Pagination>
        </div>
    )
}

export default PaginationComponent;