import { Badge, Box, Card, CircularProgress, Typography } from '@mui/joy'
import { NodeProps } from '../props'
import './ItemCard.css'

export const ItemCard: React.FC<{
  title: string
  subtitle: string
  onClick?: () => void
  alive?: boolean
}> = ({ title, subtitle, alive = true, onClick }) => {
  return (
    <Box
      className={`item-card ${alive ? 'alive' : 'dead'}`}
      sx={{
        p: 2,
        boxShadow: 'md',
        backdropFilter: 'blur(10px)',
        borderRadius: 'md',
        height: '80px',
      }}
      onClick={onClick}
    >
      <Typography
        level="body1"
        fontWeight={500}
        endDecorator={
          alive ? null : (
            <CircularProgress size="sm" variant="plain" color="warning" />
          )
        }
      >
        {title}
      </Typography>
      <Typography level="body2" color="neutral">
        {subtitle}
      </Typography>
    </Box>
  )
}

export const BoolCard: React.FC<{
  node: NodeProps
}> = () => {
  return <Box></Box>
}
