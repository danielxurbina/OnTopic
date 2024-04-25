/*
  Name: Daniel Urbina
  Date: 4/25/2024
  Course name and section: IT302-002
  Assignment Name: Phase 5
  Email: du35@njit.edu
*/

/*
    Source:
        Used this tutorial to help me with the pagination:
            https://dev.to/canhamzacode/how-to-implement-pagination-with-reactjs-2b04
*/
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