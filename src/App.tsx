import Checkbox, { OptionValue } from './components/CheckboxGroup'
import { MOCK_DATA } from './components/CheckboxGroup/data'
import './App.css'

function App() {
  const handleChange = (values: OptionValue[]) => {
    console.log(values)
  }

  return (
    <div className="container">
      <Checkbox
        options={MOCK_DATA} 
        columns={3}
        defaultChecked={['value1', 'value188']}
        checkAll={<strong>全选</strong>}
        onChange={handleChange}
      />
    </div>
  )
}

export default App
