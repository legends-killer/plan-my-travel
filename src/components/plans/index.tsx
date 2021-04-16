import React, { useState, useCallback, useContext } from 'react'
import { planListIF, planDetailPropsIF, planDetailIF } from './types'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import update from 'immutability-helper'
import Column from './column'
import Detail from './detail'
import { Button, Input } from 'antd'
import { PlanContext } from '../../utils'
import './style.less'

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const { state, dispatch } = useContext(PlanContext)
  const { pubList, columns } = state
  const addNewColumn = (id: number, title: string) => {
    let TempData = columns
    TempData.push({
      id,
      title,
      details: [],
    } as planListIF)
    console.log('add')
    dispatch({ type: 'setColumns', newVal: TempData })
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
      dispatch({ type: 'setColumns', newVal: TempData })
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

      dispatch({ type: 'setColumns', newVal: TempData })
    } else if (type === 'extra') {
    }
  }

  const handleScroll = (e: any) => {
    const delta = Math.max(
      -1,
      Math.min(1, e.nativeEvent.wheelDelta || -e.nativeEvent.detail)
    )
    console.log(e.currentTarget, delta)
    e.currentTarget.scrollLeft -= delta * 290
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    e.preventDefault
  }
  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="outter" type="col" direction="horizontal">
          {(provided) => (
            <div
              className={'planContainer'}
              {...provided.droppableProps}
              ref={provided.innerRef}
              onWheel={(e) => handleScroll(e)}
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
            <div
              className={'pubListContainer'}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
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
