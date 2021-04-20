import { Droppable } from 'react-beautiful-dnd'
import React, { useContext, useState } from 'react'
import Detail from './detail'
import Modify from './modify'
import { PlanContext } from '../../utils'
import { planDetailIF } from './types'
import { UserAgent } from '@quentin-sommer/react-useragent'

export default function PubList() {
  const { state, dispatch } = useContext(PlanContext)
  const { pubList, nextPlanId } = state
  const [lock, setLock] = useState(false)
  const [rowId, setRowId] = useState<number>()
  const [modifyVisible, setModifyVisible] = useState(false) // modify组件可见
  const [modifyType, setModifyType] = useState<'create' | 'show' | 'modify'>(
    'show'
  )
  const showModify = (rowId: number) => {
    console.log(rowId)
    setRowId(rowId)
    showPlan()
  }

  // 横向滚动
  const handleScroll = (e: any, parser: any) => {
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
    e.currentTarget.scrollLeft -= delta * 150
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    e.preventDefault
  }
  // 新增一个plan
  const addNewPlan = () => {
    setModifyType('create')
    setModifyVisible(true)
  }
  // show plan
  const showPlan = () => {
    setModifyType('show')
    setModifyVisible(true)
  }

  return (
    <>
      <UserAgent returnFullParser>
        {(parser: any) => (
          <>
            <Droppable droppableId="pub-list" type="row" direction="horizontal">
              {(provided) => (
                <div
                  className={'pubListContainer'}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  onScroll={(e) => handleScroll(e, parser)}
                >
                  {pubList.map((detail, index) => {
                    return (
                      <>
                        <Detail
                          showModify={showModify}
                          detail={detail}
                          key={detail.id}
                          detailIndex={index}
                          id={detail.id}
                        />
                      </>
                    )
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <Modify
              pos={'pubList'}
              type={modifyType}
              detail={
                modifyType === 'create' ? undefined : pubList[rowId as number]
              }
              rowId={rowId}
              visible={modifyVisible}
              setVisible={setModifyVisible}
            />
          </>
        )}
      </UserAgent>
    </>
  )
}
