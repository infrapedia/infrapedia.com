export default function(id, options = {}) {
  const button = document.createElement('button')

  button.id = id
  button.className = `editor-ctrl-btn ${options.className}`
  button.setAttribute('title', options.title)

  options.container.appendChild(button)
  if (options.icon != undefined) {
    var icon = document.createElement('i')
    icon.className = options.icon
    button.appendChild(icon)
  }

  if (options.dataset) {
    button.setAttribute(options.dataset[0], options.dataset[1])
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
