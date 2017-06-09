let isShow = false;
export function showLoading(text) {
    if(isShow) {
        return
    }
    const el = document.getElementById('loading')
    text = text || '加载中';
    if(el) {
        el.style.display = 'block'
    }
    if(text) {
        const txtEl = document.getElementById('loading_txt')
        if(txtEl) {
            txtEl.innerHTML = text
        }
    }
    isShow = true
}

export function hideLoading() {
    if(!isShow) {
        return
    }
    const el = document.getElementById('loading')
    if(el) {
        el.style.display = 'none'
    }
    isShow = false
}
