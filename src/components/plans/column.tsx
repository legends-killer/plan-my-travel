import { useContext } from 'react'
import { planListIF } from '../plans/types'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { PlanContext } from '../../utils'
import Detail from './detail'
import { DeleteOutlined } from '@ant-design/icons'

interface IProps {
  columnIndex: number
  column: planListIF
  key: number
  setInColumn: (type: boolean) => void
}

export default function Column(props: IProps) {
  const { columnIndex, column, setInColumn } = props
  const { details, id } = column
  const { state, dispatch } = useContext(PlanContext)

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
  )
}
