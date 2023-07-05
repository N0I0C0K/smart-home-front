import { Divider, Modal, ModalClose, ModalDialog, Typography } from '@mui/joy'
import { observable } from 'mobx'
import { observer } from 'mobx-react-lite'
import WarningIcon from '@mui/icons-material/Warning'

export interface WarnProps {
  title: string
  subtitle?: string
  date?: number
}

export const warnModalStatu = observable<{
  open: boolean
  props?: WarnProps
  records: WarnProps[]
  warn: (props: WarnProps) => void
  clear: () => void
  close: () => void
}>({
  open: false,
  props: {
    title: 'test',
    subtitle: 'test',
  },
  records: [],
  warn(props) {
    props.date ??= Date.now()
    this.props = props
    this.open = true
    this.records.push(props)
  },
  clear() {
    this.records.length = 0
  },
  close() {
    this.open = false
  },
})

export function showWarn(prop: WarnProps) {
  warnModalStatu.warn(prop)
}

export const WarnModal = observer(() => {
  return (
    <Modal
      open={warnModalStatu.open}
      onClose={() => {
        warnModalStatu.close()
      }}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ModalDialog color="danger" variant="soft">
        <ModalClose />
        <Typography level="h2" endDecorator={<WarningIcon />}>
          {warnModalStatu.props?.title}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Typography level="body1">{warnModalStatu.props?.subtitle}</Typography>
        <Typography level="body3">
          {new Date(warnModalStatu.props?.date ?? Date.now()).toLocaleString()}
        </Typography>
      </ModalDialog>
    </Modal>
  )
})
