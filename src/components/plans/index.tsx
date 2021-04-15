import React, { useState } from 'react'
import { planListIF, planDetailPropsIF, planDetailIF } from './types'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import update from 'immutability-helper'
import Column from './column'
import Detail from './detail'
import { Input } from 'antd'
import './style.less'

const InitialData: planListIF[] = [
  {
    id: 100,
    title: 'day1',
    details: [
      { id: 11, place: ['A'], actType: 'van' },
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

interface IProps {
  pubList: planDetailIF[]
  updateList: (newList: planDetailIF[]) => void
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (props: IProps) => {
  const [data, setData] = useState(InitialData)
  const { pubList, updateList } = props

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
      <Droppable droppableId="pub-list" type="list" direction="horizontal">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {pubList.map((item, index) => {
              return (
                <Detail
                  detail={item}
                  key={index}
                  detailIndex={index}
                  id={item.id}
                />
              )
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
