import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { CgChevronDown } from "react-icons/cg";

interface ColumnHeaderProps {
  column: string;
  index: number;
  moveColumn: (dragIndex: number, hoverIndex: number) => void;
}

interface DragColumnItem {
  index: number;
  column: string;
  type: string;
}

const ColumnType = "COLUMN";

export const ColumnHeader: React.FC<ColumnHeaderProps> = ({
  column,
  index,
  moveColumn,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<
    DragColumnItem,
    void,
    { handlerId: string | symbol | null }
  >({
    accept: ColumnType,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragColumnItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleX =
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientX = clientOffset!.x - hoverBoundingRect.left;

      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }

      moveColumn(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag<
    DragColumnItem,
    void,
    { isDragging: boolean }
  >({
    type: ColumnType,
    item: () => {
      return { column, index, type: ColumnType };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;
  drag(drop(ref));

  const getColumnLabel = (columnName: string) => {
    switch (columnName) {
      case "rank":
        return "#";
      case "title":
        return "Title";
      case "author":
        return "Author";
      case "points":
        return "Most points";
      default:
        return columnName;
    }
  };

  const getColumnClass = (columnName: string) => {
    switch (columnName) {
      case "rank":
        return "text-center";
      case "points":
        return "text-right";
      default:
        return "";
    }
  };

  return (
    <div
      ref={ref}
      className={`${getColumnClass(
        column
      )} select-none transition-opacity duration-200 text-custom-values font-medium cursor-move hover:text-custom-green text-sm`}
      style={{ opacity }}
      data-handler-id={handlerId}
    >
      <span className={`flex items-center ${column === "points" ? "justify-end" : ""}  gap-2`}>
        {getColumnLabel(column)}
        {column === "points" ? <CgChevronDown /> : null}
      </span>
    </div>
  );
};
