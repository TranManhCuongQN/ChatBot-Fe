import { TextField, TextFieldProps } from '@mui/material'
import React, { ChangeEvent } from 'react'
import { Control, useController } from 'react-hook-form'

export type InputFieldProps = TextFieldProps & {
  name: string
  control: Control<any>
}

const InputField = ({
  name,
  control,
  onChange: externalOnChange,
  onBlur: externalOnBlur,
  ref: externalRef,
  value: externalValue,
  ...rest
}: InputFieldProps) => {
  const {
    field: { onChange, onBlur, ref, value },
    fieldState: { invalid, error }
  } = useController({
    name,
    control
  })

  return (
    <TextField
      name={name}
      fullWidth
      size='small'
      margin='normal'
      value={value}
      error={!!error}
      helperText={error?.message}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        onChange(event)
        externalOnChange?.(event)
      }}
      onBlur={onBlur}
      inputRef={ref}
      {...rest}
    />
  )
}

export default InputField
