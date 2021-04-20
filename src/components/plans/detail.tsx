import { useState, memo } from 'react'
import { planDetailIF } from './types'
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd'

interface IProps {
  id: number
  colIndex?: number //所在column的位置
  detailIndex: number //所在detail的位置
  detail: planDetailIF
  setInColumn?: (type: boolean) => void
  showModify: (rowId: number, colId: number) => void
}

function areEqual(prevProps: any, nextProps: any) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps)
}

export default memo(function Detail(props: IProps) {
  const { id, detailIndex, detail, colIndex, setInColumn, showModify } = props
  console.log('detail.tsx', colIndex)
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
          onClick={() => {
            console.log('click', detailIndex)
            showModify(detailIndex, colIndex as number)
          }}
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
}, areEqual)
