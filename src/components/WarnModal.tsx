import { Divider, Modal, ModalClose, ModalDialog, Typography } from '@mui/joy'
import { observable } from 'mobx'
import { observer } from 'mobx-react-lite'
import WarningIcon from '@mui/icons-material/Warning'

export interface WarnProps {
  title: string
  subtitle?: string
}

const modalStatu = observable<{
  open: boolean
  props?: WarnProps
  warn: (props: WarnProps) => void
  close: () => void
}>({
  open: false,
  props: {
    title: 'test',
    subtitle: 'test',
  },
  warn(props) {
    this.props = props
    this.open = true
  },
  close() {
    this.open = false
  },
})

export function showWarn(prop: WarnProps) {
  modalStatu.warn(prop)
}

export const WarnModal = observer(() => {
  return (
    <Modal
      open={modalStatu.open}
      onClose={() => {
        modalStatu.close()
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
          {modalStatu.props?.title}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Typography level="body1">{modalStatu.props?.subtitle}</Typography>
        <Typography level='body3'>{(new Date()).toLocaleString()}</Typography>
      </ModalDialog>
    </Modal>
  )
})
