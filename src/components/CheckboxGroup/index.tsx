import React, { memo, useMemo, useState, useEffect, useCallback } from "react"
import "./index.css"



type OptionLabel = string | React.ReactNode
export type OptionValue = Exclude<string | number, 'check_all'> 

type Option = {
  label: OptionLabel
  value: OptionValue
}

interface Props {
  options: Option[]
  columns?: number
  defaultChecked?: Array<OptionValue>
  checkAll?: OptionLabel  // 传入checkAll支持全选，不想要支持全选可不传；
  onChange?: (value: Array<OptionValue>) => void
}

const CHECK_ALL = 'check_all' 

const CheckboxGroup: React.FC<Props> = memo((props: Props) => {
  const {
    options: customizeOptions = [],
    columns = 1,
    defaultChecked = [],
  } = props

  const [options, setOptions] = useState<Option[]>(customizeOptions)
  const [checked, setChecked] = useState<OptionValue[]>(
    // 过滤不合规的默认值
    defaultChecked.filter((c =>customizeOptions.map((o:Option) => o.value).includes(c)))
  )


  useEffect(() => {
    if ('checkAll' in props) {
      setOptions([{ label: props?.checkAll, value: CHECK_ALL }, ... customizeOptions])
      return
    }
    setOptions(customizeOptions)
  }, [customizeOptions, props.checkAll])


  const groupOptions: Option[][] = useMemo(() => {
    // columns 边界处理
    if (columns <= 0) return [options]

    const groupSize = Math.floor(options.length / columns)
    const groupCount = columns > options.length ? options.length : columns

    const result = []
    let currentIndex = 0

    for (let i = 0; i < groupCount; i++) {
      const size = i < (options.length % columns) ? groupSize + 1 : groupSize
      result.push(options.slice(currentIndex, currentIndex + size))
      currentIndex += size
    }
    return result  
  }, [options, columns])


  useEffect(() => {
    props?.onChange?.(
      checked.filter((value: OptionValue) => value !== CHECK_ALL)
    )
  }, [checked])

  const getAllOptions = useCallback(() => {
    return options.map((option: Option) => option.value)
  }, [options])

  const checkedValue = (value:OptionValue) => {
    if (!('checkAll' in props)) {
      return [...checked, value]
    } else {
      if (value === CHECK_ALL) {
        return getAllOptions()
      } else {
        if (checked.length === customizeOptions.length - 1) {
          return getAllOptions()
        }
        return [...checked, value]
      }
    }
  }

  const unCheckedValue = (value:OptionValue) => {
    if (!('checkAll' in props)) {
      return options.filter(o => o.value !==value).map(o => o.value)
    } else {
      if (value === CHECK_ALL) {
        return []
      } else {
        if (checked.length === 1) {
          return []
        }
        return options.filter(o => o.value !==value && o.value !== CHECK_ALL).map(o => o.value)
      }
    }
  }

  const handleChange = (value: OptionValue) => {
      checked.includes(value) 
        ? setChecked(unCheckedValue(value)) 
        : setChecked(checkedValue(value))
  }

  return (
    <div className="checkbox_container">
      {
        groupOptions.map((group: Option[], index: number) => (
          <div className="group" key={index}>
            {
              group.map((option: Option, idx) => (
                <label key={`${option.label}_${idx}`}>
                  <input 
                    type="checkboxGrCheckboxGroup" 
                    value={option.value} 
                    checked={checked.includes(option.value)}
                    onChange={() => handleChange(option.value)}
                  />
                  {option.label}
                </label>
              ))
            }
          </div>
        )) 
      }
    </div>
  )
})

export default CheckboxGroup