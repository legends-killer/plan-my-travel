import React, { useState } from 'react'
import { planListIF, planDetailPropsIF, planColumnPropsIF } from './types'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd'
import update from 'immutability-helper'
import './style.less'

const InitialData: planListIF[] = [
  {
    id: 100,
    title: 'day1',
    details: [
      { id: 1, place: ['A'] },
      { id: 2, place: ['B'] },
      { id: 3, place: ['A', 'B'] },
    ],
  },
  {
    id: 200,
    title: 'day2',
    details: [
      { id: 4, place: ['C'] },
      { id: 5, place: ['D'] },
    ],
  },
  {
    id: 300,
    title: 'day3',
    details: [],
  },
]

const Detail = (props: planDetailPropsIF) => {
  const { id, detailIndex, detail } = props

  return (
    <Draggable draggableId={`${id}`} index={detailIndex}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <div
          ref={provided.innerRef}
          className={snapshot.isDragging ? 'detailDragging' : 'detail'}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {detail.place}
        </div>
      )}
    </Draggable>
  )
}

const Column = (props: planColumnPropsIF) => {
  const { columnIndex, column } = props
  const { details } = column
  return (
    <div className={'column'}>
      <div className={'columnTitle'}>
        {column.title}({column.details.length})
      </div>
      <Droppable droppableId={`${columnIndex}`}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            className={
              snapshot.isDraggingOver ? 'columnContentActive' : 'columnContent'
            }
            {...provided.droppableProps}
          >
            {details.map((detail, index) => (
              <Detail
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
  )
}

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const [data, setData] = useState(InitialData)

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result
    if (!destination) {
      return
    }

    const fromColumnIndex = Number(source.droppableId)
    const fromIssueIndex = source.index
    const toColumnIndex = Number(destination.droppableId)
    const toIssueIndex = destination.index
    const TempIssue = data[fromColumnIndex].details[fromIssueIndex]

    let TempData = update(data, {
      [fromColumnIndex]: {
        details: (details) =>
          update(details, {
            $splice: [[fromIssueIndex, 1]],
          }),
      },
    })

    TempData = update(TempData, {
      [toColumnIndex]: {
        details: (details) =>
          update(details, {
            $splice: [[toIssueIndex, 0, TempIssue]],
          }),
      },
    })

    setData(TempData)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={'container'}>
        {data.map((column, index) => {
          return <Column columnIndex={index} key={column.id} column={column} />
        })}
      </div>
    </DragDropContext>
  )
}
