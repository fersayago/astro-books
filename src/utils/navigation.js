const checkIsNavigationSupported = () => {
	return Boolean(document.startViewTransition)
}

const fetchPage = async (url) => {
	// vamos a cargar la pagina de destino
	// utlilizando un fetch para obtener el HTML
	const response = await fetch(url)
	const text = await response.text()

	console.log(text)

	// quedarnos solo con el contenido del HTML dentro de body
	// usamos un regex para extraerlo
	const [, body] = text.match(/<body>(.*)<\/body>/s)

	return body
}

export const startViewTransition = () => {
	// revisa si el explorador soporta View Transition
	if (!checkIsNavigationSupported()) return

	// cada vez que navegamos entre una pagina u otra hace un console log
	window.navigation.addEventListener('navigate', (event) => {
		const toUrl = new URL(event.destination.url)

		// es una pagina externa?
		if (location.origin !== toUrl.origin) return

		// la navegacion es en el mismo dominio
		event.intercept({
			async handler () {
				const body = await fetchPage(toUrl.pathname)

				// utilizamos la API de View Transition API
				document.startViewTransition(() => {
					// como tiene que actualizar la vista
					document.body.innerHTML = body

					// mandamos el scroll arriba de todo para que vuelva
					document.documentElement.scrollTop = 0
				})
			}
		})
	})
}
