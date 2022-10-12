import { useState, useImperativeHandle, forwardRef } from 'react'
import PropTypes from 'prop-types'

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.showText}</button>
      </div>
      <div className="togglableContent" style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>{props.hideText}</button>
      </div>
    </div>
  )
})

Togglable.propTypes = {
  showText: PropTypes.string.isRequired,
  hideText: PropTypes.string.isRequired
}

Togglable.displayName = 'Togglable'

export default Togglable