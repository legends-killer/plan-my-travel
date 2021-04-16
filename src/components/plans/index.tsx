import React, { useState, useCallback, useContext } from 'react'
import { planListIF, planDetailPropsIF, planDetailIF } from './types'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import update from 'immutability-helper'
import Column from './column'
import Detail from './detail'
import { Button, Input } from 'antd'
import { PlanContext } from '../../utils'
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

// interface IProps {
//   pubList: planDetailIF[]
//   updateList: (newList: planDetailIF[]) => void
// }

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const [columns, setColumns] = useState(InitialData)
  // const { pubList, updateList } = props
  const { pubList, columns } = PlanContext
  const addNewColumn = (id: number, title: string) => {
    let TempData = columns
    TempData.push({
      id,
      title,
      details: [],
    } as planListIF)
    console.log('add')
    console.log(columns)
    setColumns(TempData)
    console.log(columns)
  }

  console.log(columns, 'build')

  const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result
    if (!destination) {
      return
    }
    if (type === 'col') {
      const from = source.index
      const to = destination.index
      let TempData = columns
      var item = TempData.splice(from, 1)
      TempData.splice(to, 0, item[0])
      setColumns(TempData)
    } else if (type === 'row') {
      const fromColumnIndex = Number(source.droppableId)
      const fromIssueIndex = source.index
      const toColumnIndex = Number(destination.droppableId)
      const toIssueIndex = destination.index
      const TempIssue = columns[fromColumnIndex].details[fromIssueIndex]
      console.log(source, destination, TempIssue)

      let TempData = update(columns, {
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

      setColumns(TempData)
    } else if (type === 'extra') {
    }
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="outter" type="col" direction="horizontal">
          {(provided) => (
            <div
              className={'container'}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {columns.map((column, index) => {
                return (
                  <Column
                    columnIndex={index}
                    key={Number(column.id)}
                    column={column}
                  />
                )
              })}
              {
                <Button
                  onClick={() => {
                    addNewColumn(columns[columns.length - 1].id + 1, 'aaa')
                  }}
                >
                  add
                </Button>
              }
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
    </>
  )
}
