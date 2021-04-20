import React, { useState, useContext, useEffect } from 'react'
import { planDetailIF, planListIF } from './types'
import { Modal, Button, message } from 'antd'
import { PlanContext } from '../../utils'

interface IProps {
  pos: 'pubList' | 'column'
  type: 'show' | 'modify' | 'create'
  colId?: number
  rowId?: number
  detail?: planDetailIF
  setVisible: (visible: boolean) => void
  visible: boolean
}

export default function Mdoify(props: IProps) {
  const { detail, pos, colId, rowId, type, visible, setVisible } = props

  const { state, dispatch } = useContext(PlanContext)
  const { pubList, columns, nextPlanId } = state
  const [plan, setPlan] = useState<planDetailIF>()

  const success = (msg: string) => {
    message.success(msg + '成功')
  }

  const error = (msg: string) => {
    message.error(msg + '失败')
  }

  useEffect(() => {
    if (detail) setPlan(detail)
    else
      setPlan({
        id: nextPlanId,
        place: [''],
      } as planDetailIF)
  }, [])

  const modifyPlan = () => {
    try {
      if (pos === 'pubList') {
        let tempData = pubList
        tempData[rowId as number] = plan as planDetailIF
        dispatch({ type: 'setPubList', newVal: tempData })
      } else {
        let tempData = columns
        tempData[colId as number].details[
          rowId as number
        ] = plan as planDetailIF
        dispatch({ type: 'setColumns', newVal: tempData })
      }
      success('修改')
    } catch (e) {
      error('修改')
    }
  }
  const createPlan = () => {
    try {
      let tempData = pubList
      tempData.splice(0, 0, plan as planDetailIF)
      dispatch({ type: 'setPubList', newVal: tempData })
      dispatch({ type: 'setNextPlanId' })
      success('创建')
      setVisible(false)
    } catch (e) {
      error('创建')
    }
  }
  const deletePlan = () => {
    try {
      if (pos === 'pubList') {
        let tempData = pubList
        tempData.splice(rowId as number, 1)
        dispatch({ type: 'setPubList', newVal: tempData })
      } else {
        let tempData = columns
        console.log(tempData)
        let row = tempData[colId as number].details
        row.splice(rowId as number, 1)
        console.log(row)
        tempData[colId as number].details = row
        console.log(tempData)
        dispatch({ type: 'setColumns', newVal: tempData })
      }
      success('删除')
      setVisible(false)
    } catch (e) {
      error('删除')
    }
  }

  return (
    <>
      <Modal
        title="Modal 1000px width"
        centered
        visible={visible}
        // onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        footer={[
          <Button key="back" onClick={() => setVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              type !== 'create' ? modifyPlan() : createPlan()
            }}
          >
            Save
          </Button>,
          <Button
            key="submit"
            type="primary"
            danger
            onClick={() => {
              deletePlan()
            }}
          >
            Delete
          </Button>,
        ]}
        width={1000}
      >
        <p>{`type: ${type}`}</p>
        <p>{`plan id: ${plan?.id}`}</p>
        <p>{`plan place: ${plan?.place}`}</p>
        <p>{`rowId: ${rowId}, colId: ${colId}`}</p>
      </Modal>
    </>
  )
}
