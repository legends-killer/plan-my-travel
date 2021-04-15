/* eslint-disable import/no-anonymous-default-export */
import Plans from '../../components/plans'
import { planDetailIF } from '../../components/plans/types'
import './style.less'

interface IProps {
  pubList: planDetailIF[]
  updateList: (newList: planDetailIF[]) => void
}

export default (props: IProps) => {
  const { pubList, updateList } = props
  console.log(pubList)
  return (
    <main className="main">
      <Plans pubList={pubList} updateList={updateList} />
    </main>
  )
}
