import { HistoryTable } from "../components/HistoryTable.js";
import { useConfig } from "../hooks/useConfig.js";

const History: React.FC = () => {
  const { history } = useConfig();

  return (
    <div>
      <HistoryTable history={history} />
    </div>
  )
}

export default History;