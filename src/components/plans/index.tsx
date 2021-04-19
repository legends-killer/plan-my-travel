import React, { useState, useCallback, useContext } from 'react'
import { planListIF, planDetailIF } from './types'
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
  const { state, dispatch } = useContext(PlanContext)
  const { pubList, columns, nextPlanId, nextColumnId } = state

  // 新增一列，删除一列在column组件中进行
  const addNewColumn = (title: string) => {
    let TempData = columns
    TempData.push({
      id: nextColumnId,
      title,
      details: [],
    } as planListIF)
    console.log('add')
    dispatch({ type: 'setColumns', newVal: TempData })
    // column id 自增
    dispatch({ type: 'setNextColumnId' })
  }
  // 开始拖拽
  const onDragStart = (initial: DragStart) => {
    // console.log(initial)
    setShowAddBtn(false)
  }
  // 结束拖拽
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
      console.log(source, destination)
      // from pubList
      if (source.droppableId === 'pub-list') {
        if (destination.droppableId !== 'pub-list') {
          // pubList -> column
          console.log('pubList -> column')
          const toColumnId = Number(destination.droppableId) // column id
          const toIssueIndex = destination.index // index in column
          const tempIssue = pubList[source.index]
          // 计算新的columns并更新context
          let TempData = update(columns, {
            [toColumnId]: {
              details: (details) =>
                update(details, {
                  $splice: [[toIssueIndex, 0, tempIssue]],
                }),
            },
          })
          dispatch({ type: 'setColumns', newVal: TempData })
          // 删除pubList对应项
          let TempList = pubList
          TempList.splice(source.index, 1)
          dispatch({
            type: 'setPubList',
            newVal: TempList,
          })
        } else {
          // pubList -> pubList
          console.log('pubList -> pubList')
          const fromIssueIndex = source.index
          const toPubListIndex = destination.index
          console.log(fromIssueIndex, toPubListIndex)

          // 计算新的pubList 更新context
          let TempData = pubList
          let item = TempData.splice(fromIssueIndex, 1)
          TempData.splice(toPubListIndex, 0, item[0])
          console.log(TempData)
          dispatch({ type: 'setPubList', newVal: TempData })
        }
      } else if (destination.droppableId === 'pub-list') {
        console.log('column -> pubList')
        // column -> pubList
        const fromColumnId = Number(source.droppableId)
        const fromColumnIndex = source.index
        const toPubListIndex = destination.index
        // 计算新的columns 和 pubList 并设置
        let TempData = columns
        const item = TempData[fromColumnId].details[fromColumnIndex]
        TempData[fromColumnId].details.splice(fromColumnIndex, 1)

        let TempList = pubList
        TempList.splice(toPubListIndex, 0, item)

        dispatch({ type: 'setColumns', newVal: TempData })
        dispatch({
          type: 'setPubList',
          newVal: TempList,
        })
      } else {
        // column -> column
        console.log('column -> column')
        const fromColumnIndex = Number(source.droppableId)
        const fromIssueIndex = source.index
        const toColumnIndex = Number(destination.droppableId)
        const toIssueIndex = destination.index
        const TempIssue = columns[fromColumnIndex].details[fromIssueIndex]

        let TempData = update(columns, {
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

        dispatch({ type: 'setColumns', newVal: TempData })
      }
    } else {
      console.log('err!!! failed to drop or drag')
    }
    setShowAddBtn(true)
  }
  // 横向滚动
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
    // console.log(delta)
    // if (!delta && os === 'Mac OS') return
    // console.log(e, delta)
    e.currentTarget.scrollLeft -= delta * 150
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    e.preventDefault
  }
  // 控制是否为横向滚动
  const setInColumn = (type: boolean) => {
    // console.log(type)
    setIsIncolumn(type)
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
                          key={column.id}
                          column={column}
                          setInColumn={setInColumn}
                        />
                      )
                    })}
                    {showAddBtn && (
                      <Button
                        onClick={(e) => {
                          addNewColumn('aaa')
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
          <Droppable droppableId="pub-list" type="row" direction="horizontal">
            {(provided) => (
              <div
                className={'pubListContainer'}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {pubList.map((detail, index) => {
                  return (
                    <Detail
                      detail={detail}
                      key={detail.id}
                      detailIndex={index}
                      id={detail.id}
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
