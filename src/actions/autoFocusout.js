export const autoFocusout = (el, focusoutListener) => {
    const focusinListener = (e) => {
        // edit 모드 영역
        e.stopPropagation();
    };

    setTimeout(() => {
        el.addEventListener('click', focusinListener);    
        window.addEventListener('click', focusoutListener);
    });

    return {
        destroy() {
            el.removeEventListener('click', focusinListener)
            window.removeEventListener('click', focusoutListener);
        }
    }
}