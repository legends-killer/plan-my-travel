import React, { useState, useCallback, useContext } from 'react'
import { planListIF, planDetailPropsIF, planDetailIF } from './types'
import {
  DragDropContext,
  Droppable,
  DropResult,
  DragStart,
} from 'react-beautiful-dnd'
import update from 'immutability-helper'
import Column from './column'
import Detail from './detail'
import { Button, Input } from 'antd'
import { PlanContext } from '../../utils'
import { UserAgentProvider, UserAgent } from '@quentin-sommer/react-useragent'
import './style.less'

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const [isInColumn, setIsIncolumn] = useState(false)
  const [lock, setLock] = useState(false)
  const [showAddBtn, setShowAddBtn] = useState(true)
  const setInColumn = (type: boolean) => {
    console.log(type)
    setIsIncolumn(type)
  }
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

  const onDragStart = (initial: DragStart) => {
    console.log(initial)
    setShowAddBtn(false)
  }

  const onDragEnd = (result: DropResult) => {
    setShowAddBtn(true)
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

  const handleScroll = (e: any, parser: any) => {
    if (isInColumn) return
    if (lock) return
    const os = parser.getOS().name
    if (os === 'Mac OS') return
    setLock(true)
    setTimeout(() => {
      setLock(false)
    }, 300)
    const delta = Math.max(
      -1,
      Math.min(1, e.nativeEvent.wheelDelta || -e.nativeEvent.detail)
    )
    console.log(delta)
    // if (!delta && os === 'Mac OS') return
    console.log(e, delta)
    e.currentTarget.scrollLeft -= delta * 150
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    e.preventDefault
  }
  return (
    <>
      <UserAgentProvider ua={window.navigator.userAgent}>
        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
          <Droppable droppableId="outter" type="col" direction="horizontal">
            {(provided) => (
              <UserAgent returnFullParser>
                {(parser: any) => (
                  <div
                    className={'planContainer'}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    onWheel={(e) => handleScroll(e, parser)}
                  >
                    {columns.map((column, index) => {
                      return (
                        <Column
                          columnIndex={index}
                          key={Number(column.id)}
                          column={column}
                          setInColumn={setInColumn}
                        />
                      )
                    })}
                    {showAddBtn && (
                      <Button
                        onClick={(e) => {
                          addNewColumn(
                            columns[columns.length - 1].id + 1,
                            'aaa'
                          )
                        }}
                      >
                        add
                      </Button>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </UserAgent>
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
      </UserAgentProvider>
    </>
  )
}
