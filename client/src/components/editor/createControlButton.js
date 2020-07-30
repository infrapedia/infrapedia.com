export default function(id, options = {}) {
  const button = document.createElement('button')
  button.className = `editor-ctrl-btn ${options.className}`
  button.setAttribute('title', options.title)
  options.container.appendChild(button)
  if (options.icon !== undefined) {
    var ii = document.createElement('i')
    ii.className = options.icon
    button.appendChild(ii)
  }
  button.addEventListener(
    'click',
    e => {
      e.preventDefault()
      e.stopPropagation()
      if (!options.eventListener) return
      options.eventListener(e)
    },
    true
  )

  button.style.setProperty('background-repeat', 'no-repeat')
  button.style.setProperty('display', options.visible ? 'block' : 'none')

  return button
}
