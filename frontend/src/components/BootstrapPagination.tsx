import Pagination from 'react-bootstrap/Pagination';
interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (pageNumber: number) => void;
    maxVisibleButtons: number;
}

export default function BootstrapPagination(props: PaginationProps) {
    const getPageButtons = () => {
        const pageButtons = [];
        for (let i = 1; i <= props.totalPages; i++) {
            if (
                i === 1 ||
                i === props.totalPages ||
                (i >= props.currentPage - 1 && i <= props.currentPage + 1) ||
                (i >= props.totalPages - props.maxVisibleButtons + 1 && i <= props.totalPages)
            ) {
                pageButtons.push(
                    <Pagination.Item
                        key={i}
                        active={i === props.currentPage}
                        onClick={() => props.onPageChange(i)}
                    >
                        {i}
                    </Pagination.Item>
                );
            } else if (
                i === props.currentPage - 3 ||
                i === props.currentPage + 3
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
            <Pagination.Prev onClick={() => props.onPageChange(props.currentPage - 1)} disabled={props.currentPage === 1} />
            {getPageButtons()}
            <Pagination.Next onClick={() => props.onPageChange(props.currentPage + 1)} disabled={props.currentPage === props.totalPages} />
        </Pagination>
    );
}