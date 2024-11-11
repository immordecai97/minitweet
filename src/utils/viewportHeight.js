/**
 * Función que establece el valor de la variable CSS --vh dinamicamente
 * en función de la altura de la ventana del navegador para evitar problemas
 * con el tamaño de la ventana en dispositivos móviles.
 */
export function setViewportHeight(){
    let vh = window.innerHeight * 0.01;
    // console.log('VH --> ',vh);
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}