import Button from 'react-bootstrap/Button';
import Pagination from 'react-bootstrap/Pagination';

export default function BootstrapPagination({ currentPage, totalPages, onPageChange, maxVisibleButtons }) {
    const getPageButtons = () => {
        const pageButtons = [];
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - 1 && i <= currentPage + 1) ||
                (i >= totalPages - maxVisibleButtons + 1 && i <= totalPages)
            ) {
                pageButtons.push(
                    <Pagination.Item
                        key={i}
                        active={i === currentPage}
                        onClick={() => onPageChange(i)}
                    >
                        {i}
                    </Pagination.Item>
                );
            } else if (
                i === currentPage - 3 ||
                i === currentPage + 3
            ) {
                pageButtons.push(
                    <Pagination.Ellipsis key={`ellipsis-${i}`} disabled />
                );
            }
        }
        return pageButtons;
    };
    return (
        <Pagination>
            <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} />
            {getPageButtons()}
            <Pagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} />
        </Pagination>
    );
}