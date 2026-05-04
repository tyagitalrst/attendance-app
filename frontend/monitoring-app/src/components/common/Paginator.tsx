interface Props {
  pageNo: number;
  pageSize: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function Paginator({
  pageNo,
  pageSize,
  totalRecords,
  onPageChange,
  onPageSizeChange,
}: Props) {
  const totalPages = Math.ceil(totalRecords / pageSize);
  const from = totalRecords === 0 ? 0 : (pageNo - 1) * pageSize + 1;
  const to = Math.min(pageNo * pageSize, totalRecords);

  function pageNumbers() {
    const delta = 2;
    const start = Math.max(1, pageNo - delta);
    const end = Math.min(totalPages, pageNo + delta);
    const pages: number[] = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  const pages = pageNumbers();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm">
      <div className="flex items-center gap-2 text-gray-600">
        <span>Show</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="rounded border border-gray-300 px-2 py-1"
        >
          {[10, 20, 50].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span>per page</span>
      </div>

      <span className="text-gray-500">
        {from}–{to} of {totalRecords}
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(pageNo - 1)}
          disabled={pageNo === 1}
          className="rounded px-2 py-1 hover:bg-gray-100 disabled:opacity-40"
        >
          ‹
        </button>

        {pages[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="rounded px-2 py-1 hover:bg-gray-100"
            >
              1
            </button>
            {pages[0] > 2 && <span className="px-1 text-gray-400">…</span>}
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`rounded px-2 py-1 ${
              p === pageNo ? "bg-orange-600 text-white" : "hover:bg-gray-100"
            }`}
          >
            {p}
          </button>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <span className="px-1 text-gray-400">…</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="rounded px-2 py-1 hover:bg-gray-100"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(pageNo + 1)}
          disabled={pageNo >= totalPages || totalPages === 0}
          className="rounded px-2 py-1 hover:bg-gray-100 disabled:opacity-40"
        >
          ›
        </button>
      </div>
    </div>
  );
}
