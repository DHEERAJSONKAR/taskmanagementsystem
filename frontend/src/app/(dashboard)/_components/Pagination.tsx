'use client';

interface PaginationProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

export default function Pagination({ page, totalPages, setPage }: PaginationProps) {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      <button
        onClick={handlePrev}
        disabled={page === 1}
        className="px-4 py-2 text-sm font-medium bg-white border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={page === totalPages}
        className="px-4 py-2 text-sm font-medium bg-white border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}
