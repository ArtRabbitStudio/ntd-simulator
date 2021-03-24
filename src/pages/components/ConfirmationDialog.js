import React from 'react'
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
} from '@material-ui/core'

const ConfirmationDialog = props => {
  const { onClose, onConfirm, open, title, intro, ...other } = props

  const handleCancel = () => {
    onClose()
  }
const { t } = useTranslation();
  const handleOk = () => {
    onConfirm()
  }

  return (
    <Dialog
      maxWidth="xs"
      aria-labelledby="confirmation-dialog-title"
      open={open}
      onClose={handleCancel}
      {...other}
    >
      <DialogTitle disableTypography id="confirmation-dialog-title">
        <Typography variant="h3" component="h2" style={{ marginTop: '8px' }}>
          {title}
        </Typography>
        <Typography variant="body2" component="p" style={{ marginTop: '8px' }}>
          {intro}
        </Typography>
      </DialogTitle>
      <DialogActions
        style={{ padding: '8px 16px 24px', justifyContent: 'center' }}
      >
        <Button onClick={handleCancel} variant="contained">
          {t('cancel')}
        </Button>
        <Button onClick={handleOk} color="primary" variant="contained">
          {t('ok')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

ConfirmationDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
}

export default ConfirmationDialog
