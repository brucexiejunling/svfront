const duration = 2000;
let wrapEl = document.createElement('div')
let msgEl = document.createElement('span')

wrapEl.style.display = 'none'
wrapEl.style.width = '100%'
wrapEl.style.position = 'fixed'
wrapEl.style.top = '9rem'
wrapEl.style.left = '0'
wrapEl.style.fontSize = 14/(375/10) + 'rem'
wrapEl.style.textAlign = 'center'
wrapEl.style.zIndex = '111111'

msgEl.style.display = 'inline-block'
msgEl.style.background = 'rgba(1,1,1,0.8)'
msgEl.style.color = '#fff'
msgEl.style.padding = '6px 10px'
msgEl.style.borderRadius = '4px'

wrapEl.appendChild(msgEl)
document.body.appendChild(wrapEl)

let timer;
export function toast(msg, d) {
    if(timer) {
        clearTimeout(timer)
        timer = null
    }
    d = d ? d : duration
    msgEl.innerHTML = msg
    wrapEl.style.display = 'block'
    timer = setTimeout(()=> {
        wrapEl.style.display = 'none'
        timer = null
    }, d)
}