const CLIPBOARD_STACK_SIZE = 5
const ITEM_MAX_LENGTH = 20

exports.addToStack = (item, stack) => {
    return [item].concat(stack.length >= CLIPBOARD_STACK_SIZE 
        ? stack.slice(0, stack.length - 1) 
        : stack
    )
}

exports.checkForChange = (clipboard, onChange) => {
    let cache = clipboard.readText()
    let latest
    setInterval(_ => {
        latest = clipboard.readText()
        if (latest !== cache) {
            cache = latest
            onChange(cache)
        }
    }, 1000)
}

exports.registerShortcuts = (globalShortcut, clipboard, stack) => {
    globalShortcut.unregisterAll()
    for (let i = 0; i < CLIPBOARD_STACK_SIZE; i++) {
        globalShortcut.register(`CommandOrControl+${i + 1}`, _ => {
            clipboard.writeText(stack[i])
        })
    }
}

formatItem = (item) => {
    return item && item.length > ITEM_MAX_LENGTH
        ? item.substr(0, ITEM_MAX_LENGTH) + '...'
        : item
}

exports.menuTemplate = (clipboard, stack) => {
    return stack.map((item, i) => {
        return {
            label: `Copy: ${formatItem(item)}`,
            click: _ => clipboard.writeText(item),
            accelerator: `CommandOrControl+${i + 1}`
        }
    })
}