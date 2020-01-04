export default function(id, options = {}) {
  const button = document.createElement('button')
  button.className = `editor-ctrl-btn ${options.className}`
  button.setAttribute('title', options.title)
  options.container.appendChild(button)

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
