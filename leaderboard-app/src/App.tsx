import { useCallback, useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { BiUser } from "react-icons/bi";
import { ColumnHeader } from "./components/ColumnHeader";
import { LeaderboardItem } from "./components/LeaderboardItem";
import { videoService } from "./services/videoService";
import type { ApiResponse, Video } from "./types";

function App() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [columnOrder, setColumnOrder] = useState([
    "rank",
    "title",
    "author",
    "points",
  ]);

  const loadVideos = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const response: ApiResponse = await videoService.getPaginatedVideos(
        page,
        10
      );
      setVideos(response.list);
      setCurrentPage(response.page);
      setTotalPages(response.num_pages);
      setTotal(response.total);
    } catch (error) {
      console.error("Failed to load videos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVideos(1);
  }, [loadVideos]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      loadVideos(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      loadVideos(currentPage + 1);
    }
  };

  const moveItem = useCallback((dragIndex: number, hoverIndex: number) => {
    setVideos((prevVideos) => {
      const newVideos = [...prevVideos];
      const draggedItem = newVideos[dragIndex];
      newVideos.splice(dragIndex, 1);
      newVideos.splice(hoverIndex, 0, draggedItem);
      return newVideos;
    });
  }, []);

  const moveColumn = useCallback((dragIndex: number, hoverIndex: number) => {
    setColumnOrder((prevOrder) => {
      const newOrder = [...prevOrder];
      const draggedColumn = newOrder[dragIndex];
      newOrder.splice(dragIndex, 1);
      newOrder.splice(hoverIndex, 0, draggedColumn);
      return newOrder;
    });
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-custom-bg font-system">
        {/* Header */}
        <header className="max-w-[1200px] mx-auto flex justify-between items-center px-10 py-5 mb-10">
          <div className="text-5xl font-bold text-white">APP</div>
          <button className="bg-custom-green text-[#707D5D] border-none px-6 py-3 rounded-full text-sm cursor-pointer flex items-center gap-1 hover:bg-green-400 transition-colors">
            <BiUser size={16} /> Logout
          </button>
        </header>

        {/* Main Content */}
        <main className="px-10 pb-10 max-w-[1200px] mx-auto">
          <div className="mb-7 flex justify-between items-end">
            <div className="flex flex-col">
              <p
                className="text-[48px]"
                style={{
                  fontWeight: "100",
                }}
              >
                Today's leaderboard
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm bg-[#1D1D1D] px-6 py-3 rounded-2xl">
              <span className="text-custom-titles font-normal">
                30 May 2022
              </span>
              <span className="bg-custom-green text-[#707D5D] px-2 py-1 rounded-2xl text-xs">
                SUBMISSIONS OPEN
              </span>
              <span className="text-custom-titles font-normal">11:34</span>
            </div>
          </div>

          {/* Table Header with Draggable Columns - No Border */}
          <div
            className="grid gap-5 py-4 px-6 text-sm text-custom-values font-medium mb-4"
            style={{
              gridTemplateColumns: columnOrder
                .map((col) => {
                  switch (col) {
                    case "rank":
                      return "60px";
                    case "title":
                      return "1fr";
                    case "author":
                      return "200px";
                    case "points":
                      return "150px";
                    default:
                      return "1fr";
                  }
                })
                .join(" "),
            }}
          >
            {columnOrder.map((column, index) => (
              <ColumnHeader
                key={column}
                column={column}
                index={index}
                moveColumn={moveColumn}
              />
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-10">
              <div className="text-custom-green text-base">Loading...</div>
            </div>
          )}

          {/* Leaderboard Items - Individual Cards */}
          {!loading && (
            <div className="flex flex-col gap-4">
              {videos.map((video, index) => (
                <LeaderboardItem
                  key={video.id}
                  video={video}
                  index={index}
                  rank={(currentPage - 1) * 10 + index + 1}
                  moveItem={moveItem}
                  columnOrder={columnOrder}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-between items-center mt-8 pt-5">
            <div className="text-gray-400 text-sm">
              Showing {(currentPage - 1) * 10 + 1} -{" "}
              {Math.min(currentPage * 10, total)} of {total} entries
            </div>
            <div className="flex items-center gap-4">
              <button
                className="bg-gray-700border-none px-4 py-2 rounded text-sm cursor-pointer transition-colors hover:bg-custom-green hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handlePrevPage}
                disabled={currentPage <= 1 || loading}
              >
                ← Prev
              </button>
              <span className="text-gray-400 text-sm min-w-[100px] text-center">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="bg-gray-700 border-none px-4 py-2 rounded text-sm cursor-pointer transition-colors hover:bg-custom-green hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages || loading}
              >
                Next →
              </button>
            </div>
          </div>
        </main>
      </div>
    </DndProvider>
  );
}

export default App;
