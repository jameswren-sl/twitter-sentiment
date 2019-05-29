import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Button, CircularProgress } from '@material-ui/core'

const styles = {
  loadingWrapper: {
    position: 'relative',
    display: 'inline',
    width: '100%'
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
}

function LoadingButton (props) {
  const { loading, disabled, onClick, classes, children } = props

  return (
    <div className={classes.loadingWrapper} >
      <Button variant='contained' color='primary' fullWidth disabled={disabled || loading} onClick={onClick}>{ children }</Button>
      { loading && <CircularProgress size={24} className={classes.loading} /> }
    </div>
  )
}

LoadingButton.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired
}

export default withStyles(styles)(LoadingButton)
