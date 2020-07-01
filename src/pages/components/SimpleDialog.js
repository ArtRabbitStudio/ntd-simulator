import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({}))

const SimpleDialog = props => {
  const { onClose, open, title, ...other } = props
  const classes = useStyles()

  const handleCancel = () => {
    onClose()
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
      </DialogTitle>
      <DialogActions
        style={{ padding: '8px 16px 24px', justifyContent: 'center' }}
      >
      </DialogActions>
    </Dialog>
  )
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
}

export default SimpleDialog
