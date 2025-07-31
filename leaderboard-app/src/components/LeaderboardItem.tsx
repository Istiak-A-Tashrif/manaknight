import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { BiUser } from 'react-icons/bi';
import { FaArrowUp } from 'react-icons/fa';
import type { DragItem, Video } from '../types';

interface LeaderboardItemProps {
  video: Video;
  index: number;
  rank: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  columnOrder: string[];
}

const ItemType = 'LEADERBOARD_ITEM';

export const LeaderboardItem: React.FC<LeaderboardItemProps> = ({
  video,
  index,
  rank,
  moveItem,
  columnOrder
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: string | symbol | null }>({
    accept: ItemType,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveItem(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag<DragItem, void, { isDragging: boolean }>({
    type: ItemType,
    item: () => {
      return { id: video.id, index, type: ItemType };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;
  drag(drop(ref));

  // Helper function to get user name (shuffled since all user_id is 1)
  const getUserName = (videoId: number) => {
    const userNames = ['ninaoris', 'deniscrypto', 'meta_word98', 'kingdom43world', 'gi39874230pariaf'];
    return userNames[videoId % userNames.length];
  };

  const renderColumn = (columnType: string) => {
    switch (columnType) {
      case 'rank':
        return <div className="text-center text-base text-custom-values font-medium">{rank.toString().padStart(2, '0')}</div>;
      case 'title':
        return (
          <div className="flex items-center gap-4">
            <img src={video.photo} alt="thumbnail" className="w-16 h-12 rounded-lg object-cover" />
            <span className="text-sm leading-[1.4] font-normal">{video.title}</span>
          </div>
        );
      case 'author':
        return (
          <div className="flex items-center gap-2 text-custom-author text-sm">
            <div className="w-5 h-5 bg-custom-author rounded-full flex items-center justify-center text-xs">
              <BiUser className='text-black' size={12} />
            </div>
            <span className="text-custom-author font-normal">{getUserName(video.id)}</span>
          </div>
        );
      case 'points':
        return (
          <div className="flex items-center justify-end gap-2 text-base">
            <span className="font-medium">{video.likes}</span>
            <FaArrowUp className="text-custom-green text-sm"></FaArrowUp>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={ref}
      className="grid gap-5 py-4 px-6 !pl-2 border border-[#2F2F2F] rounded-xl bg-[#111111] items-center transition-colors duration-200 cursor-grab hover:bg-[#0F0F0F] active:cursor-grabbing"
      style={{ 
        opacity,
        gridTemplateColumns: columnOrder.map(col => {
          switch (col) {
            case 'rank': return '60px';
            case 'title': return '1fr';
            case 'author': return '200px';
            case 'points': return '150px';
            default: return '1fr';
          }
        }).join(' '),
      }}
      data-handler-id={handlerId}
    >
      {columnOrder.map((column) => (
        <div key={column} className={`col-${column}`}>
          {renderColumn(column)}
        </div>
      ))}
    </div>
  );
};
