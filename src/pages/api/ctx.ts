const rules = `Use beautiful dark tailwind bootstrap styles.
Use bright blue to accent design elements.
That markup will be embedded to existing html page so don't set backgroud color.
All DOM elements should be visiable.
Don't add any <script> tags or js code there.
Don't use modal.
For card and chart use div wrapper to display them in center.
Write just only next view markup and skip previous one if it don't need anymore.
Always use this format:
${"```"}html
markup
${"```"}`

export const createPromptCtx = (prompt: string, data: string) => `
Write beautiful dark tailwind html markup to show ${prompt}
[ Data ]
${data}
[ RULES ]
${rules}`

export const createViewCtx = (view: string, data: string) => `
Use following markup to write next view user should get in browser.
Right now user made click event that in the markup notes as attribute current-event="[ CLICK ]" on target DOM element.
[ CURRENT VIEW ]
${view}
[ Data ]
${data}
[ RULES ]
${rules}`
