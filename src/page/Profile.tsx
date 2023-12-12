import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
  Typography,
} from '@mui/joy'
import { observer } from 'mobx-react-lite'
import { centerManager } from '../store/center'
import { useState } from 'react'

const BaseSetting = observer(() => {
  const [base, setBase] = useState(centerManager.base)
  const [error, setError] = useState<string>()
  const ChangeBaseClick = () => {
    if (!/^[A-Za-z]+$/.test(base)) {
      setError('Only letters appear')
      return
    }
    setError(undefined)
    centerManager.changeBase(base)
  }
  return (
    <FormControl>
      <FormLabel>Change Base Key</FormLabel>
      <Input
        value={base}
        color={error ? 'danger' : 'neutral'}
        onChange={(ev) => {
          setBase(ev.target.value)
        }}
        endDecorator={
          <Button variant="outlined" onClick={ChangeBaseClick}>
            Change
          </Button>
        }
        variant="soft"
      />
      {error && (
        <FormHelperText
          sx={(theme) => ({ color: theme.vars.palette.danger[400] })}
        >
          {error}
        </FormHelperText>
      )}
    </FormControl>
  )
})

export const ProfilePage = observer(() => {
  return (
    <Box>
      <Typography level="h2" fontWeight={700}>
        Home Setting
      </Typography>
      <Stack direction={'column'} mt={10}>
        <BaseSetting />
      </Stack>
    </Box>
  )
})
