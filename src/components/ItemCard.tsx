import { Badge, Box, Card, CircularProgress, Typography } from '@mui/joy'
import { NodeProps } from '../props'
import SettingsIcon from '@mui/icons-material/Settings'
import TuneIcon from '@mui/icons-material/Tune'
import './ItemCard.css'

export const ItemCard: React.FC<{
  title: string
  subtitle: string
  onClick?: () => void
  alive?: boolean
  itemType: 'bool' | 'number'
  value?: number
}> = ({ title, subtitle, alive = true, onClick, itemType, value = 0 }) => {
  return (
    <Box
      className={`item-card ${alive ? 'alive' : 'dead'} ${
        value === 0 ? 'deactive' : null
      }`}
      sx={{
        p: 2,
        boxShadow: 'md',
        backdropFilter: 'blur(10px)',
        borderRadius: 'md',
        height: '80px',
      }}
      onClick={onClick}
    >
      <Box display={'flex'} alignItems={'center'}>
        <Typography level="body1" fontWeight={500}>
          {title}
        </Typography>
        <Box flexGrow={1} />
        {itemType === 'bool' ? null : <TuneIcon fontSize="medium" />}
        {alive ? null : (
          <CircularProgress
            size="sm"
            variant="plain"
            color="warning"
            thickness={2}
          />
        )}
      </Box>
      <Typography level="body2" color="neutral">
        {subtitle}
      </Typography>
      <Typography
        level="h4"
        sx={{
          position: 'absolute',
          bottom: '10px',
          right: '15px',
        }}
      >
        {value}
      </Typography>
    </Box>
  )
}

export const BoolCard: React.FC<{
  node: NodeProps
}> = () => {
  return <Box></Box>
}
