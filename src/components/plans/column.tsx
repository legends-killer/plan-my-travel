import { planColumnPropsIF } from './types'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import Detail from './detail'

export default function Column(props: planColumnPropsIF) {
  const { columnIndex, column, setInColumn } = props
  const { details, id } = column
  return (
    <Draggable draggableId={`${id}`} index={columnIndex}>
      {(provided) => (
        <div
          className={'column'}
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <div className={'columnTitle'} {...provided.dragHandleProps}>
            {column.title}
            {column.id}({column.details.length})
          </div>
          <Droppable droppableId={`${columnIndex}`} type="row">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                className={
                  snapshot.isDraggingOver
                    ? 'columnContentActive'
                    : 'columnContent'
                }
                {...provided.droppableProps}
              >
                {details.map((detail, index) => (
                  <Detail
                    setInColumn={setInColumn}
                    key={detail.id}
                    detailIndex={index}
                    id={detail.id}
                    detail={detail}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  )
}
