import { planDetailPropsIF } from './types'
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd'

export default function Detail(props: planDetailPropsIF) {
  const { id, detailIndex, detail, setInColumn } = props
  return (
    <Draggable draggableId={`${id}`} index={detailIndex}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <div
          ref={provided.innerRef}
          className={` ${
            snapshot.isDragging ? 'detailDragging' : 'detail'
          } panel `}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onMouseEnter={() => {
            setInColumn && setInColumn(true)
          }}
          onMouseLeave={() => {
            setInColumn && setInColumn(false)
          }}
        >
          <div className="cardpanel">
            <div className="card">
              <div className="picture">
                {detail.place}
                <div className="glass" />
              </div>
              <div className="title"></div>
            </div>
            <div className="labelpart">
              <p>Label</p>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}
