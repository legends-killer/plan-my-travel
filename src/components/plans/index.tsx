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
import { Input } from 'antd'
import './style.less'

const InitialData: planListIF[] = [
  {
    id: 100,
    title: 'day1',
    details: [
      { id: 1, place: ['A'], actType: 'van' },
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
          className={` ${
            snapshot.isDragging ? 'detailDragging' : 'detail'
          } panel `}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
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
          {/* <Input placeholder={detail.actType} bordered={false} /> */}
        </div>
      )}
    </Draggable>
  )
}

const Column = (props: planColumnPropsIF) => {
  const { columnIndex, column } = props
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

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const [data, setData] = useState(InitialData)

  const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result
    if (!destination) {
      return
    }
    if (type === 'col') {
      const from = source.index
      const to = destination.index
      let TempData = data
      var item = TempData.splice(from, 1)
      TempData.splice(to, 0, item[0])
      setData(TempData)
    } else if (type === 'row') {
      const fromColumnIndex = Number(source.droppableId)
      const fromIssueIndex = source.index
      const toColumnIndex = Number(destination.droppableId)
      const toIssueIndex = destination.index
      const TempIssue = data[fromColumnIndex].details[fromIssueIndex]
      console.log(source, destination, TempIssue)

      let TempData = update(data, {
        [fromColumnIndex]: {
          details: (details) =>
            update(details, {
              $splice: [[fromIssueIndex, 1]],
            }),
        },
      })
      console.log(TempData)

      TempData = update(TempData, {
        [toColumnIndex]: {
          details: (details) =>
            update(details, {
              $splice: [[toIssueIndex, 0, TempIssue]],
            }),
        },
      })

      setData(TempData)
    } else if (type === 'extra') {
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="outter" type="col" direction="horizontal">
        {(provided) => (
          <div
            className={'container'}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {data.map((column, index) => {
              return (
                <Column columnIndex={index} key={column.id} column={column} />
              )
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
