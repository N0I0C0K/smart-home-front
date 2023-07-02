import { Badge, Box, Card, Typography } from '@mui/joy'

export const ItemCard: React.FC<{
  title: string
  subtitle: string
  onClick?: () => void
  alive?: boolean
}> = ({ title, subtitle, alive = true, onClick }) => {
  return (
    <Box
      sx={{
        p: 2,
        boxShadow: 'md',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderRadius: 'md',
        height: '80px',
      }}
      onClick={onClick}
    >
      <Typography level='body1' fontWeight={500}>
        {title}
      </Typography>
      <Typography level='body2' color='neutral'>
        {subtitle}
      </Typography>
    </Box>
  )
}
