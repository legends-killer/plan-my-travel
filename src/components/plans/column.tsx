import { useContext, useState, memo } from 'react'
import { planListIF } from '../plans/types'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { PlanContext } from '../../utils'
import Detail from './detail'
import Modify from './modify'
import { DeleteOutlined } from '@ant-design/icons'

interface IProps {
  columnIndex: number
  column: planListIF
  key: number
  setInColumn: (type: boolean) => void
}

// 性能优化
function areEqual(prevProps: any, nextProps: any) {
  /*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
  */
  return JSON.stringify(prevProps) === JSON.stringify(nextProps)
}

export default memo(function Column(props: IProps) {
  console.log('column.tsx')
  const { columnIndex, column, setInColumn } = props
  const { details, id } = column
  const { state, dispatch } = useContext(PlanContext)
  const [rowId, setRowId] = useState<number>()
  const [colId, setColId] = useState<number>()
  const [modifyVisible, setModifyVisible] = useState(false) // modify组件可见
  const [modifyType, setModifyType] = useState<'create' | 'show' | 'modify'>(
    'show'
  )
  //show plan
  const showModify = (rowId: number, colId: number | undefined) => {
    console.log('11111', colId)
    setColId(colId)
    setRowId(rowId)
    setModifyType('show')
    setModifyVisible(true)
  }
  // 删除一列，其中内容放到待选列表
  const removeColumn = () => {
    const tempData = state.columns
    const itemsWillBeRemoved = column.details
    tempData.splice(columnIndex, 1)
    dispatch({ type: 'setColumns', newVal: tempData })
    const tempPubList = state.pubList
    itemsWillBeRemoved.forEach((item) => {
      tempPubList.push(item)
    })
    dispatch({ type: 'setPubList', newVal: tempPubList })
  }

  return (
    <>
      <Draggable draggableId={`${id}`} index={columnIndex}>
        {(provided) => (
          <div
            className={'column'}
            {...provided.draggableProps}
            ref={provided.innerRef}
          >
            <div className={'columnTitle'} {...provided.dragHandleProps}>
              {/* {console.log(column.details)} */}
              {column.id}({column.details.length})
              <DeleteOutlined onClick={removeColumn} style={{ fontSize: 17 }} />
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
                      showModify={showModify}
                      colIndex={columnIndex}
                      setInColumn={setInColumn}
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
      {modifyVisible && (
        <Modify
          pos={'column'}
          type={modifyType}
          detail={
            modifyType === 'create' ? undefined : details[rowId as number]
          }
          rowId={rowId}
          colId={colId}
          visible={modifyVisible}
          setVisible={setModifyVisible}
        />
      )}
    </>
  )
}, areEqual)
