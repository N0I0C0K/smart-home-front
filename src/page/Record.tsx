import { Box, Card, IconButton, List, Typography } from '@mui/joy'
import { observer } from 'mobx-react-lite'
import { warnModalStatu } from '../components/WarnModal'
import './Record.css'
import ClearIcon from '@mui/icons-material/Clear'

export const RecordPage = observer(() => {
  return (
    <Box>
      <Typography level="h2" fontWeight={700}>
        Recrd
      </Typography>
      <Box display={'flex'} gap={1} flexDirection={'column'} my={5}>
        {warnModalStatu.records.map((val, i) => {
          return (
            <Box
              key={i}
              className={'record-card'}
              sx={{
                p: 2,
                boxShadow: 'md',
                backdropFilter: 'blur(10px)',
                borderRadius: 'md',
              }}
            >
              <Typography level="h4">{val.title}</Typography>
              <Typography level="body1">{val.subtitle}</Typography>
              <Typography
                level="body3"
                sx={{
                  position: 'absolute',
                  bottom: 10,
                  right: 10,
                }}
              >
                {new Date(val.date ?? Date.now()).toLocaleString()}
              </Typography>
            </Box>
          )
        })}
        <IconButton
          variant="plain"
          size="lg"
          sx={{ mt: 5 }}
          onClick={() => [warnModalStatu.clear()]}
        >
          <ClearIcon />
        </IconButton>
      </Box>
    </Box>
  )
})
